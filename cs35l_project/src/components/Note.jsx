
import "./Note.css";

function Note({ note }){
    return(
        <div className="note-card">
            <h1>{note.title || "Untitled Thought"}</h1>
            <p>{note.text}</p>
        </div>
    );
}

export default Note;