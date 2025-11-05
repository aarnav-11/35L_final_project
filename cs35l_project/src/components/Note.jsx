
import "./Note.css";
import RemoveNoteButton from "./RemoveNoteButton";

function Note({ note, onRemoveNote }){
    return(
        <div className="note-card">
            <div className="note-header">
                <RemoveNoteButton onRemoveNote={onRemoveNote} />
                <h1>{note.title || "Untitled Thought"}</h1>
            </div>
            <p>{note.text}</p>
        </div>
    );
}

export default Note;