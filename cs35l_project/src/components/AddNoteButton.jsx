
import React, {useState} from "react";
import "./AddNoteButton.css"


function AddNoteButton(){
    const [notes, setNotes] = useState([]);
    const [newNoteText, setNewNoteText] = useState("");
    const [isEditorOpen, setIsEditorOpen] = useState(false);

    const handleInputChange = (event) => {
        setNewNoteText(event.target.value);
    };
    const addNote = () => {
        if (newNoteText.trim() !== '') { // Prevent adding empty notes
            const newNote = {
                id: Date.now(), // Unique ID for the note
                text: newNoteText,
            };
            setNotes([...notes, newNote]);
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
            <button className= "save-button" onClick={addNote} >Save</button>
            <button className="cross-button" onClick={() => setIsEditorOpen(false)}>x</button>
          </div>
        )}

      </div>
    );
}

export default AddNoteButton;