
import React from "react";
import { Link } from 'react-router-dom';
import "./Navigation.css"

function Navigation(){
    return(
        <nav className="navigation">
          <div className="home"><Link to="/">Home</Link></div>
          <div className="about"><Link to="/about">About</Link></div>
          <div className="contact"><Link to="/contact">Contact</Link></div>
          <div className="calendar"><Link to="/calendar">Calendar</Link></div>
        </nav>
    );
}

export default Navigation;