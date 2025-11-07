
import React, {useState} from "react";
import "./AddNoteButton.css";

function AddNoteButton({ onAddNote }){
    const [newNoteText, setNewNoteText] = useState("");
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [addTitle, setAddTitle] = useState("");

    const handleTextChange = (event) => {
        setNewNoteText(event.target.value);
    };
    const handleTitleChange = (event) => {
      if (event.target.value.length >= 100) {
          alert("Title is too long. Please enter a shorter title.");
          return;
      }
        setAddTitle(event.target.value);
    };
    
    const handleSave = () => {
        if (newNoteText.trim() === '') {
            alert("Note text cannot be empty");
            return;
        }
        if (newNoteText.trim() !== '') {
            onAddNote(addTitle, newNoteText); // call the function passed from app
            setNewNoteText(''); // clear the input field
            
            setAddTitle(''); // clear the title input field
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
            <textarea className="note-title"
              value={addTitle}
              onChange={handleTitleChange}
              placeholder="Add a title..."
            />
            <textarea className="note-content"
              value={newNoteText}
              onChange={handleTextChange}
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