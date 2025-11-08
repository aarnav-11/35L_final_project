
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
                    <label for="name"><h3>Name:</h3></label>
                    <input type="text" id="name" name="name" placeholder= "Enter your name" className="name"></input>
                </div>
                <div>
                    <label for="age"><h3>Age:</h3></label>
                    <input type="text" id="age" name="age" placeholder= "Enter your age" className="age"></input>
                </div>
                <div>
                    <label for="username"><h3>Username:</h3></label>
                    <input type="text" id="username" name="username" placeholder= "Enter your username" className="username"></input>
                </div>
                <div>
                    <label for="password"><h3>Password:</h3></label>
                    <input type="text" id="password" name="password" placeholder="Enter your password" className="password"></input>
                </div>
            </div>
            <div className="signButtons">
                <button onClick={ () => navigate("/home")}>Sign Up</button>
                <button onClick={ () => navigate("/home")}>Log in</button>
            </div>
        </div>
    );
}

export default Authentication;