import copyImg from '../assets/images/copy.svg';

type RoomCodeProps = {
    code: string;
}

export function RoomCode(props: RoomCodeProps){
    function copyToClipboard(){
         navigator.clipboard.writeText(props.code)
    }
    return(
        <button className="room-code" onClick={copyToClipboard}>
            <div>
                <img src={copyImg} alt="Copie o código da sala" />
            </div>
            <span>Sala #{props.code}</span>
        </button>
    );
}