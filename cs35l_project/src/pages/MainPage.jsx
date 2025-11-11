
import { useState } from 'react'
import './MainPage.css'
import Searchbar from '../components/Searchbar'
import AddNoteButton from "../components/AddNoteButton"
import Note from "../components/Note"
import { useEffect } from "react";
import Navigation from '../components/Navigation'
import UploadNotesButton from "../components/UploadNotesButton";


const API_BASE_URL = "http://localhost:3000/notes";

function MainPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  //fetch notes from db
  const fetchNotes = async () => {
    try{
      setLoading(true);
      const response = await fetch(API_BASE_URL);
      
      if (!response.ok){
        throw new Error('Failed to fetch notes');
      }

      const data = await response.json();
      setNotes(data);
      setLoading(false);

    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

    useEffect(() => {
      fetchNotes();
    }, []);

  const addNote = async (title, noteText) => {
    try{
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title || "Untitled Thought", 
          text: noteText
        })
      });

      if (!response.ok){
        throw new Error('Failed to add note');
      }

      const newNote = await response.json();

      //add new note to the notes array beginning
      setNotes([newNote, ...notes]);
    } catch (err) {
      console.error(err);
      alert(`Failed to add note, please try again`);
    }
  }

  const removeNote = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });

      if (!res.ok) throw new Error(`Failed to delete note (${res.status})`);
      // if server returns 204, there’s no body to parse then skip res.json()
      setNotes(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete note, please try again');
    }
  };

  const q = searchQuery.toLowerCase();
  const filteredNotes = q
    ? notes.filter(n =>
        (n.title && n.title.toLowerCase().includes(q)) ||
        (n.text && n.text.toLowerCase().includes(q))
      )
    : notes;

  return(
    <div className='app'>
      <div className='navigation'>
        <Navigation/>
      </div>
      <div className="header-container">
        <Searchbar value={searchQuery} onChange={setSearchQuery} />
        <AddNoteButton onAddNote={addNote} />
        <UploadNotesButton onUpload={(newNote) => setNotes([newNote, ...notes])} />
      </div>
      <div className='notes-grid'>
        {filteredNotes.map((note) => (
          <Note key={note.id} note={note} onRemoveNote={() => removeNote(note.id)} />
        ))}
      </div>
    </div>
  );
}

export default MainPage;
