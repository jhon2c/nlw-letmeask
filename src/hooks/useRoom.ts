import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import { useAuth } from "./useAuth";

type QuestionProps = {
    id: string;
    author:{
        name: string;
        avatar: string;
    }
    content: string;
    isHighlighted: boolean;
    isAnswered: boolean; 
    likeCount: number;
    likeId: string | undefined;
}

type FirebaseQuestions = Record<string,{
    author:{
        name: string;
        avatar: string;
    }
    content: string;
    isHighlighted: boolean;
    isAnswered: boolean;
    likes: Record<string,{
        authorId: string;
    }>
}>;

export function useRoom(roomId: string,sortBy?:boolean){
    const {user} = useAuth();
    const [questions,setQuestions] = useState<QuestionProps[]>([]);
    const [title, setTitle] = useState('');

    useEffect(() =>{
        
        let roomRef = database.ref(`rooms/${roomId}`);
        roomRef.on('value',room => {
            const databaseRoom = room.val();
            const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};
            const parsedQuestion = Object.entries(firebaseQuestions).map( ([key,value])  => {
                return{
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighlighted: value.isHighlighted,
                    isAnswered: value.isAnswered,
                    likeCount: Object.values(value.likes ?? {}).length,
                    likeId: Object.entries(value.likes ?? {}).find(([key,like]) =>like.authorId === user?.id)?.[0],
                }
            });
            var byLikes = parsedQuestion.slice(0).sort(function(b,a) {
                return a.likeCount - b.likeCount;
            });
            var byRecent = parsedQuestion.slice(0).sort(function(b,a) {
                return parseInt(a.id) - parseInt(b.id);
            });

            if (sortBy){
                setTitle(databaseRoom.title);
                setQuestions(byLikes);
            } else {
                setTitle(databaseRoom.title);
                setQuestions(byRecent);
            }
            
        })

        return () => {
            roomRef.off('value');
        }
    },[roomId,sortBy,user?.id]);

    return{questions, title};
    
}