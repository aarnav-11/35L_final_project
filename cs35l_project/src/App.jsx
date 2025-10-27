
import { useState } from 'react'
import './App.css'
import Searchbar from './components/Searchbar'
import AddNoteButton from "./components/AddNoteButton"

function App() {
  return(
    <div className='app'>
      <div className="header-container">
        <Searchbar/>
        <AddNoteButton/>
      </div>
      
    </div>
  );
}

export default App;
