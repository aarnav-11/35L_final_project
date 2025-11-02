
import React, {useState} from "react";
import "./AddNoteButton.css";

function AddNoteButton({ onAddNote }){
    const [newNoteText, setNewNoteText] = useState("");
    const [isEditorOpen, setIsEditorOpen] = useState(false);

    const handleInputChange = (event) => {
        setNewNoteText(event.target.value);
    };
    
    const handleSave = () => {
        if (newNoteText.trim() !== '') {
            onAddNote(newNoteText); // Call the function passed from App
            setNewNoteText(''); // Clear the input field
            setIsEditorOpen(false);
        }
    };

    return(
        <div className="addnote-wrapper">
        {!isEditorOpen && (
          <button className="addnote" onClick={() => setIsEditorOpen(true)}>
            +
          </button>
        )}

        {isEditorOpen && (
          <div className="note-editor">
            <textarea
              value={newNoteText}
              onChange={handleInputChange}
              placeholder="Add a new note..."
            />
            <button className="save-button" onClick={handleSave}>Save</button>
            <button className="cross-button" onClick={() => setIsEditorOpen(false)}>x</button>
          </div>
        )}
      </div>
    );
}

export default AddNoteButton;