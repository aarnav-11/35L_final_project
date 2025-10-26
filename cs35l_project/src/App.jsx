import { useState } from 'react'
import './App.css'
import Searchbar from './components/Searchbar'

function App() {
  return(
    <div className='app'>
      <div className="searchbar">
        <Searchbar/>
      </div>
    </div>
  );
}

export default App;
