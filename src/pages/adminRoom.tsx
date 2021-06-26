import { useParams, useHistory } from 'react-router';
import logoImg from '../assets/images/logo.svg';
import { Button } from '../components/button';
import { Question } from '../components/question';
import { RoomCode } from '../components/roomCode';
//import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';

import deletImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';

import '../styles/room.scss';
import { database } from '../services/firebase';
import { useState } from 'react';

type roomParams ={
id: string;
}

export function AdminRoom(){
//const { user } = useAuth();
const history = useHistory();
const params = useParams<roomParams>();
    const [sort, setSort] = useState(false);
    const roomId = params.id;
    const {title,questions} = useRoom(roomId,sort);
    const [alert, setAlert] = useState(true);

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

    async function handleAnswered(questionId:string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
    isAnswered:true,
    likes:{}
    });

    }

    async function handleHighlighted(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
    isHighlighted:true
    });
    }

    return(
    <div id="page-room">
        <header>
            <div className="content">
                <img src={logoImg} alt="LetmeAsk" />
                <div>
                    <RoomCode code={roomId} />
                    <Button isOutlined onClick={handleEndRoom}>
                        Encerrar Sala
                    </Button>
                </div>

            </div>
        </header>
        <div className="main">
            <div className={alert ? 'alert' : 'hide' }>
                <span className="close"><button type="button" onClick={()=>{
                        setAlert(!alert);
                        }}
                        >
                        <img src={deletImg} alt="Fechar" />
                    </button></span>
                Envie o código acima para enviarem as perguntas ou o através do link
                : <a target="_blank" rel="noreferrer" href={window.location.origin + window.location.pathname.slice(6)}>
                    {window.location.origin + window.location.pathname.slice(6)}</a>
            </div>

            <div className="room-title">
                <h1>Sala: {title}</h1>
                { questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
                <button className="sort" onClick={()=> {
                    setSort(!sort);
                    }}>
                    <span>{sort ? "Mais curtida ▲" : "Mais recente ▼" }</span>
                </button>

            </div>



            <div className="questionList">
                {questions.map(question => {
                return(
                <Question key={question.id} content={question.content} author={question.author}
                    isHighlighted={question.isHighlighted} isAnswered={question.isAnswered}
                    likeCount={question.likeCount}>
                    {!question.isAnswered && (
                    <>
                        <span className="small">{question.likeCount} Curtida(s)</span>
                        <button type="button" onClick={()=> handleAnswered(question.id)}
                            >
                            <img src={checkImg} alt="Marcar como respondida" />
                        </button>
                        <button type="button" onClick={()=> handleHighlighted(question.id)}
                            >
                            <img src={answerImg} alt="Destacar a pergunta" />
                        </button>
                    </>
                    )}
                    <button type="button" onClick={()=> handleDelete(question.id)}
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