
import React, { useState } from "react";
import "./Authentication.css";
import { Navigate, useNavigate } from 'react-router-dom';
import StashLogo from "../../assets/stash-logo.png";



function Authentication(){
    const navigate = useNavigate();
    const [action, setAction] = useState("Sign Up");

        return (
        <div className="auth-page">
            <div className="auth-panel">
                {/* LEFT SIDE – form */}
                <div className="auth-left">
                    {action === "Log In" ? (
                        <>
                            <h1 className="auth-title">Hello There!</h1>
                            <p className="auth-subtitle">
                                Welcome back, you’ve been missed.
                            </p>

                            <div className="field">
                                <label htmlFor="loginEmail">Email</label>
                                <input
                                    id="loginEmail"
                                    type="email"
                                    placeholder="Enter your email"
                                />
                            </div>

                            <div className="field">
                                <label htmlFor="loginPassword">Password</label>
                                <input
                                    id="loginPassword"
                                    type="password"
                                    placeholder="Enter your password"
                                />
                            </div>

                            <button type="button" className="primary-action">
                                Log In
                            </button>

                            <p className="switch-text">
                                Don’t have an account?{" "}
                                <button
                                    type="button"
                                    className="inline-link"
                                    onClick={() => setAction("Sign Up")}
                                >
                                    Sign up
                                </button>
                            </p>
                        </>
                    ) : (
                        <>
                            <h1 className="auth-title">Create an account</h1>
                            <p className="auth-subtitle">
                                Sign up to start saving and organizing your Stash.
                            </p>

                            <div className="field">
                                <label htmlFor="name">Name</label>
                                <input
                                    id="name"
                                    type="text"
                                    placeholder="Enter your name"
                                />
                            </div>

                            <div className="field">
                                <label htmlFor="birthday">Birthday</label>
                                <input
                                    id="birthday"
                                    type="date"
                                />
                            </div>

                            <div className="field">
                                <label htmlFor="email">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                />
                            </div>

                            <div className="field">
                                <label htmlFor="password">Create password</label>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Create a password"
                                />
                            </div>

                            <div className="field">
                                <label htmlFor="confirmPassword">Confirm password</label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Re-enter your password"
                                />
                            </div>

                            <button type="button" className="primary-action">
                                Sign Up
                            </button>

                            <p className="switch-text">
                                Already have an account?{" "}
                                <button
                                    type="button"
                                    className="inline-link"
                                    onClick={() => setAction("Log In")}
                                >
                                    Log in
                                </button>
                            </p>
                        </>
                    )}
                </div>

                {/* RIGHT SIDE – logo / brand area */}
        <div className="auth-right">
            <div className="brand-card">
                <img 
                    src={StashLogo} 
                    alt="Stash logo"
                    className="brand-logo"
                />
            </div>
        </div>
    </div>
</div>
           
    );
    
}


export default Authentication;