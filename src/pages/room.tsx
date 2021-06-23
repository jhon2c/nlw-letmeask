import { FormEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import logoImg from '../assets/images/logo.svg';
import { Button } from '../components/button';
import { RoomCode } from '../components/roomCode';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';
import '../styles/room.scss';

type roomParams ={
    id: string;
}

type FirebaseQuestions = Record<string,{
    author:{
        name: string;
        avatar: string;
    }
    content: string;
    isHighlighted: boolean;
    isAnswered: boolean;
}>;
type Question = {
    id: string;
    author:{
        name: string;
        avatar: string;
    }
    content: string;
    isHighlighted: boolean;
    isAnswered: boolean;
}

export function Room(){
    const { user } = useAuth();
    const params = useParams<roomParams>();
    const [newQuestion, setNewQuestion] = useState('');
    const [questions,setQuestions] = useState<Question[]>([]);
    const [title, setTitle] = useState('');

    const roomId = params.id;

    useEffect(() =>{
        const roomRef = database.ref(`rooms/${roomId}`);
        roomRef.on('value',room => {
            const databaseRoom = room.val();
            const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};
            const parsedQuestion = Object.entries(firebaseQuestions).map( ([key,value])  => {
                return{
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighlighted: value.isHighlighted,
                    isAnswered: value.isAnswered
                }
            });
            setTitle(databaseRoom.title);
            setQuestions(parsedQuestion)
        })
    },[roomId]);

    async function sendQuestion(event: FormEvent){
        event.preventDefault();
        //event?.preventDefault();
        if (newQuestion.trim() === ''){
            return;
        }
        if(!user){
            return;
        }
        const question ={
            content: newQuestion,
            author: {
                name: user.name,
                avatar: user.avatar
            },
            isHighlighted: false,
            isAnswered: false
        }

        await database.ref(`rooms/${roomId}/questions`).push(question);
        setNewQuestion('');
    }

    return(
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="LetmeAsk" />
                    <RoomCode code = {roomId} />
                </div>
            </header>
            <div className="main">
                <div className="room-title">
                    <h1>Sala: {title}</h1>
                    { questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
                    
                </div>
                <form onSubmit={sendQuestion}>
                    <textarea 
                        placeholder="Faça sua pergunta"
                        onChange={event => setNewQuestion(event.target.value)}
                        value={newQuestion}
                    />
                    <div className="form-footer">
                        { user ?(
                            <div className="userInfo">
                                <img src={user.avatar} alt={user.name} />
                                <span>{user.name}</span>
                            </div>
                        ) : (
                            <span>Para enviar uma pergunta, <button>faça login</button></span>
                        ) 
                    }
                        <Button type="submit" disabled={!user}>Enivar Pergunta</Button>
                    </div>
                </form>
                {JSON.stringify(questions)}
            </div>
        </div>
    );
}