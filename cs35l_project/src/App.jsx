
import { useState } from 'react'
import './App.css'
import Searchbar from './components/Searchbar'
import AddNoteButton from "./components/AddNoteButton"
import Note from "./components/Note"

function App() {
  const [notes, setNotes] = useState([]);

  const addNote = (title, noteText) => {
    if (noteText.trim() !== '') {
      const newNote = {
        id: Date.now(),
        title: title,
        text: noteText,
      };
      setNotes([newNote, ...notes]);
    }
  };

  return(
    <div className='app'>
      <div className="header-container">
        <Searchbar/>
        <AddNoteButton onAddNote={addNote} />
      </div>
      <div className='notes-grid'>
        {notes.map((note) => (
          <Note key={note.id} note={note} />
        ))}
      </div>
    </div>
  );
}

export default App;
