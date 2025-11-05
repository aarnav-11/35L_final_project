
import "./RemoveNoteButton.css";

function RemoveNoteButton({ onRemoveNote }){
    return(
        <button className="remove-note-button" onClick={onRemoveNote}>x</button>
    );
}

export default RemoveNoteButton;