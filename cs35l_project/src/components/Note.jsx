
import "./Note.css";
import RemoveNoteButton from "./RemoveNoteButton";

function Note({ note, onRemoveNote }){
    return(
        <div className="note-card">
            <div className="note-header">
                <RemoveNoteButton onRemoveNote={onRemoveNote} />
                <h1>{note.title || "Untitled Thought"}</h1>
            </div>
            {/* if note is uploaded file show link, otherwise show text */}
            {note.text && note.text.startsWith("http://localhost:3000/uploads") ? (
                // <a 
                //     href={note.text} 
                //     target="_blank" 
                //     rel="noopener noreferrer"
                //     style={{ color: "blue", textDecoration: "underline" }}
                // >
                //     Open Uploaded File
                // </a>
                <a href={note.text} target="_blank" rel="noopener noreferrer">
                    Open Uploaded File
                </a>
            ) : (
                <p>{note.text}</p>
            )}
        </div>
    );
}

export default Note;