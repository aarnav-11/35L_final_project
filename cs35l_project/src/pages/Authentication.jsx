
import React from "react";
import "./Authentication.css";
import { Navigate, useNavigate } from 'react-router-dom';

function Authentication(){
    const navigate = useNavigate();
    return(
        <div className="mainBox">
            <div className="auth">
                <h1>Unlock the full potential of your mind</h1>
            </div>
            <div className="authBody"> 
                <div>
                    <label for="username">Username:</label>
                    <input type="text" id="username" name="username" className="username"></input>
                </div>
                <div>
                    <label for="password">Password:</label>
                    <input type="text" id="password" name="password" className="password"></input>
                </div>
            </div>
            <button onClick={ () => navigate("/home")}>Sign Up</button>
        </div>
    );
}

export default Authentication;