
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
      <div className='notes-grid'>
        <div className='note-card'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Autem sunt architecto hic similique tempore aperiam cumque laborum dicta iste eos recusandae obcaecati ullam magni, vero sint doloremque at exercitationem debitis!</div>
        <div className='note-card'>bcaadaasadjemndjek</div>
        <div className='note-card'>c</div>
        <div className='note-card'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere nostrum nihil quis, aliquam mollitia nemo velit modi magni, reiciendis sequi nam alias minus cupiditate consectetur fugiat eos voluptatibus. Voluptatibus, sit?</div>
        <div className='note-card'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi totam, optio quis, facere voluptatum modi aut asperiores culpa soluta molestiae eos maxime eveniet cupiditate quia minus. Assumenda, fugit. Praesentium, aliquid!</div>
      </div>
      
    </div>
  );
}

export default App;
