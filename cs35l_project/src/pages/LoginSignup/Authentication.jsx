
import React, { useState } from "react";
import "./Authentication.css";
import { Navigate, useNavigate } from 'react-router-dom';

function Authentication(){
    const navigate = useNavigate();
    const [action, setAction] = useState("Sign Up");

    return(
        <div className="mainMainBox">
            <div className="mainBox">
                <div className="auth">
                    <h1>{action}</h1>
                </div>
                <div className="authBody"> 
                    {action === "Log In" ? <div></div> : 
                    <div>
                        <div>
                            <label for="name"><h3>Name:</h3></label>
                            <input type="text" id="name" name="name" placeholder= "Enter your name" className="name"></input>
                        </div>
                        <div>
                            <label for="age"><h3>Age:</h3></label>
                            <input type="text" id="age" name="age" placeholder= "Enter your age" className="age"></input>
                        </div>
                        <div>
                            <label for="favProf"><h3>Favorite Professor:</h3></label>
                            <input type="text" id="favProf" name="favProf" placeholder= "Enter your favorite professor" className="favProf"></input>
                        </div>
                    </div>
                    }

                    <div>
                        <label for="email"><h3>Email:</h3></label>
                        <input type="text" id="email" name="email" placeholder= "Enter your email" className="email"></input>
                    </div>
                    <div>
                        <label for="password"><h3>Password:</h3></label>
                        <input type="text" id="password" name="password" placeholder="Enter your password" className="password"></input>
                    </div>
                    {action === "Log In" ? 
                    <div className="forgotPass">
                        Forgot your password <button>click me!</button>
                    </div>
                    :<></>
                }
                </div>
                <div className="signButtons">
                    <button onClick={ () => setAction("Sign Up")} className="signButton">Sign Up</button>
                    <button onClick={ () => setAction("Log In")} className ="signButton">Log in</button>
                </div>
            </div>
        </div>
        
    );
}

export default Authentication;