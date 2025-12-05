
import { useState } from 'react'
import './MainPage.css'
import Searchbar from '../components/Searchbar'
import AddNoteButton from "../components/AddNoteButton"
import UploadNoteButton from "../components/UploadNoteButton"
import Note from "../components/Note"
import { useEffect } from "react";
import Navigation from '../components/Navigation'
import LogoutButton from '../components/LogoutButton'
import Background from '../components/Background'

const API_BASE_URL = "http://localhost:3000/api/notes";

function MainPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  //fetch notes from db
  const fetchNotes = async () => {
    try{
      setLoading(true);
      const response = await fetch(API_BASE_URL, { credentials: 'include' });
      
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
      setError(null);
      const response = await fetch(API_BASE_URL, {
        credentials: 'include',
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
        alert('Failed to add note, login credentials expired');
        throw new Error('Failed to add note, login credentials expired');
      }

      const newNote = await response.json();
      
      setNotes([newNote, ...notes]);
    } catch (err) {
      console.error(err);
      setError('Failed to add note, please try again');
    }
  }

  const removeNote = async (id) => {
    try {
      setError(null);
      const res = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE', credentials: 'include' });

      if (!res.ok) throw new Error(`Failed to delete note (${res.status})`);
      // if server returns 204, there’s no body to parse then skip res.json()
      setNotes(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error(err);
      setError('Failed to delete note, please try again');
    }
  };

  const uploadNote = async (file) => {
    // try{
    //   setLoading(true);
    //   const response = await fetch(API_BASE_URL);
      
    //   if (!response.ok){
    //     throw new Error('Failed to fetch notes');
    //   }

    //   const data = await response.json();
    //   uploadNote(data);
    //   setLoading(false);

    // } catch (err) {
    //   setError(err.message);
    //   setLoading(false);
    // }
    const formData = new FormData();
    formData.append("file", file);
    try{
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (!response.ok){
        throw new Error('Failed to upload note');
      }

      const newNote = await response.json();

      setNotes([newNote, ...notes]);
    } catch (err) {
      console.error(err);
      alert(`Failed to upload note, please try again`);
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
        <Background />
        <div className='navigation'>
        <Navigation/>
      </div>
      <div className="header-container">
        <Searchbar value={searchQuery} onChange={setSearchQuery} />
        <AddNoteButton onAddNote={addNote} />
        <UploadNoteButton onUploadNote={uploadNote} />
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