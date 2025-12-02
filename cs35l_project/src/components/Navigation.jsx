
import React, { useContext } from "react";
import { Link } from 'react-router-dom';
import "./Navigation.css"
import LogoutButton from './LogoutButton'
import { AuthContext } from '../context/AuthContext'

function Navigation(){
    const { isAuthenticated } = useContext(AuthContext);
    
    return(
        <nav className="navigation">
          <div className="home"><Link to="/home">Home</Link></div>
          <div className="spaces"><Link to="/spaces">Spaces</Link></div>
          {!isAuthenticated ? (
            <div className="login"><Link to="/">Log In</Link></div>
          ) : (
            <div className="logout"><LogoutButton /></div>
          )}
        </nav>
    );
}

export default Navigation;