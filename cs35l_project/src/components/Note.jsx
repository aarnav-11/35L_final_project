
import "./Note.css";

function Note({ note }){
    return(
        <div className="note-card">
            <h1>{note.title}</h1>
            <p>{note.text}</p>
        </div>
    );
}

export default Note;