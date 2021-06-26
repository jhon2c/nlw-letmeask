import { FormEvent, useState} from 'react';
import { Link, useHistory } from 'react-router-dom';
import { database } from '../services/firebase';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';

import { Button } from '../components/button';
import '../styles/auth.scss';
import { useAuth } from '../hooks/useAuth';

export function NewRoom() {
    const {user} = useAuth();
    const history = useHistory();
    const [newRoom, setNewRoom] = useState('');

    async function CreateRoom(event: FormEvent){
        event.preventDefault();

        if(newRoom.trim() === '') {
            return;
        }

        const roomRef = database.ref('rooms');
        var key = Date.now().toString();
        await roomRef.child(key).set({
            key: key,
            title: newRoom,
            authorId: user?.id,
        });
        history.push(`/admin/rooms/${key}`);
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
                        <h2>Olá, {user?.name.split(' ').shift()}, vamos criar uma nova sala?</h2>
                    <form onSubmit={CreateRoom}>
                        <input 
                            type="text" 
                            placeholder="Nome da sala"
                            onChange={event => setNewRoom(event.target.value)}
                            value={newRoom}
                        />
                        <Button type="submit"> Criar Sala </Button>
                    </form>
                    <p>Deseja entrar em uma sala existente? <Link to="/">Clique aqui</Link></p>
                </div>
            </main>
        </div>
    )
}