import { FormEvent, useState } from 'react';
import {useHistory} from 'react-router-dom'
import { useAuth } from '../hooks/useAuth';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIcon from '../assets/images/google-icon.svg';

import { Button } from '../components/button';

import '../styles/auth.scss';
import { database } from '../services/firebase';

export function Home() {
    const history = useHistory();
    const { user, signinWithGoogle } = useAuth();
    const [roomCode, setRoomCode] = useState('');

    async function handleCreateRoom(){
        if(!user){
            await signinWithGoogle();
        }
        history.push(`/rooms/create`);
    }

    async function handleJoinRoom(event:FormEvent){
        event.preventDefault();

        if(roomCode.trim() === ''){
            return;
        }

        const roomRef = await database.ref(`rooms/${roomCode}`).get();
        
        if(!roomRef.exists()){
            alert("Room does not exists!");
            return;
        }
        
        history.push(`/rooms/${roomCode}`);
    }

    return(
        <div id="page-auth">
            <aside>
                <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
                <strong>Crie sua sala de perguntas ao vivo</strong>
                <p>Tire as dúvidas em tempo real!</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={logoImg} alt="Letmeask" />
                    <Button onClick={handleCreateRoom} className="create-room">
                        <img src={googleIcon} alt="" />
                        Crie sua sala com o Google
                    </Button>
                    <div className="separator">
                        Ou entre em uma sala
                    </div>
                    <form onSubmit={handleJoinRoom}>
                        <input 
                            type="text" 
                            placeholder="Digite o código da sala"
                            onChange={event => setRoomCode(event.target.value)}
                            value = {roomCode}
                        />
                        <Button type="submit"> Entrar na Sala </Button>
                    </form>
                </div>
            </main>
        </div>
    )
}