
import React, { useState, useContext} from "react";
import "./Authentication.css";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Background from '../../components/Background';

function Authentication(){
    const navigate = useNavigate();
    const { signup, login, isAuthenticated } = useContext(AuthContext);

    const [action, setAction] = useState("Sign Up");
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [favProf, setFavProf] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    //if already authenticated, redirect to home
    React.useEffect(() => {
        if (isAuthenticated) {
            navigate("/home");
        }
    }, [isAuthenticated, navigate]);

    //handle submission (login/signup)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (action === "Sign Up") {
                await signup(name, age, favProf, email, password);
            } else {
                await login(email, password);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Clear error when switching between Sign Up and Log In
    const handleActionChange = (newAction) => {
        setAction(newAction);
        setError("");

        setName("");
        setAge("");
        setFavProf("");
        setEmail("");
        setPassword("");
    };

    return(
        
        <div className="mainMainBox">
            <Background />
            <div className="mainBox">
                <form onSubmit={handleSubmit}>
                <div className="auth">
                    <h1>{action}</h1>
                </div>
                <div className="authBody"> 
                    { error && <div className="error">{error}</div>}
                    {action === "Log In" ? <div></div> : 
                    <div>
                        <div>
                            <label htmlFor="name"><h3>Name:</h3></label>
                            <input type="text" id="name" name="name" placeholder= "Enter your name" className="name" value={name} onChange= {(e) => setName(e.target.value)} ></input>
                        </div>
                        <div>
                            <label htmlFor="age"><h3>Age:</h3></label>
                            <input type="text" id="age" name="age" placeholder= "Enter your age" className="age" value={age} onChange = {(e) => setAge(e.target.value)}></input>
                        </div>
                        <div>
                            <label htmlFor="favProf"><h3>Favorite Professor:</h3></label>
                            <input type="text" id="favProf" name="favProf" placeholder= "Enter your favorite professor" className="favProf" value = {favProf} onChange={(e) => setFavProf(e.target.value)}></input>
                        </div>
                    </div>
                    }

                    <div>
                        <label htmlFor="email"><h3>Email:</h3></label>
                        <input type="email" id="email" name="email" placeholder= "Enter your email" className="email" value = {email} onChange = {(e) => setEmail(e.target.value)}></input>
                    </div>
                    <div>
                        <label htmlFor="password"><h3>Password:</h3></label>
                        <input type="password" id="password" name="password" placeholder="Enter your password" className="password" value = {password} onChange = {(e) => setPassword(e.target.value)}></input>
                    </div>
                    {action === "Log In" ? 
                        <div className="forgotPass">
                            Forgot your password?{" "}
                            <button
                                type="button"
                                onClick={() => navigate("/forgot-password")}
                            >
                                Click me!
                            </button>
                        </div>
                    : null}
                </div>
                <div className="signButtons">
                    <button  onClick={ () => setAction("Sign Up")} className="signButton">Sign Up</button>
                    <button  onClick={ () => setAction("Log In")} className ="signButton">Log in</button>
                </div>
                </form>
            </div>
        </div>
        
    );
}

export default Authentication;