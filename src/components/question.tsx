import { ReactNode } from 'react';
import cx from 'classnames';
import '../styles/question.scss';

type QuestionType ={
    content:string;
    author:{
        name:string;
        avatar:string;
    }
    children?:ReactNode;
    isAnswered?:boolean;
    isHighlighted?:boolean;
}

export function Question({
    content,
    author,
    children,
    isAnswered=false,
    isHighlighted=false
}: QuestionType) { 
    return(
        <div className={cx(
            'question',
            {answered: isAnswered},
            {highlighted: isHighlighted && !isAnswered}
        )}>
            <p>{content}</p>
            <footer>
            <div className="userInfo">
                <img src={author.avatar} alt={author.name} />
                <span>{author.name}</span>
            </div>
            <div>{children}</div>
            </footer>
        </div>
    );
 
}