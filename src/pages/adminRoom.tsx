import { useParams, useHistory } from 'react-router';
import logoImg from '../assets/images/logo.svg';
import { Button } from '../components/button';
import { Question } from '../components/question';
import { RoomCode } from '../components/roomCode';
//import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';
import deletImg from '../assets/images/delete.svg';
import '../styles/room.scss';
import { database } from '../services/firebase';

type roomParams ={
    id: string;
}
 
export function AdminRoom(){
    //const { user } = useAuth();
    const history = useHistory();
    const params = useParams<roomParams>();

    const roomId = params.id;
    const {title,questions} = useRoom(roomId);

    async function handleEndRoom() {
        await database.ref(`rooms/${roomId}`).update({
            endedAt: new Date(),
        })

        history.push(`/`)
        
    }

    async function handleDelete(questionId: string){
        if(window.confirm('Tem certeza que deseja exlcuir essa pergunta?')){
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
        }
    }

    return(
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="LetmeAsk" />
                    <div>
                        <RoomCode code = {roomId} />
                        <Button 
                        isOutlined
                        onClick={handleEndRoom}
                        >
                            Encerrar Sala
                        </Button>
                    </div>
                    
                </div>
            </header>
            <div className="main">
                <div className="room-title">
                    <h1>Sala: {title}</h1>
                    { questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
                    
                </div>
                <div className="questionList">
                    {questions.map(question => {
                        return(
                            <Question
                            key = {question.id}
                            content = {question.content}
                            author = {question.author}
                            >
                                <button
                                    type="button"
                                    onClick={() => handleDelete(question.id)}
                                    >
                                        <img src={deletImg} alt="Remover a pergunta" />
                                    </button>
                            </Question>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}