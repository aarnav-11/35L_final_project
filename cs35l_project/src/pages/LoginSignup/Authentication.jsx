import React, { useState, useContext } from "react";
import "./Authentication.css";
import { AuthContext } from "../../context/AuthContext";
import StashLogo from "../../assets/stash-logo.png";

function Authentication() {
  const { signup, login } = useContext(AuthContext);

  const [action, setAction] = useState("Sign Up");

  // form state
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (action === "Sign Up") {
        if (password !== confirmPassword) {
          setError("Passwords do not match.");
          setLoading(false);
          return;
        }

        // matches the new signup(name, age, email, password)
        await signup(name, age, email, password);
      } else {
        await login(email, password);
      }
      // navigation to /home happens inside AuthContext on success
    } catch (err) {
      console.error("auth error:", err);

      if (err.message === "Failed to fetch" || err.name === "TypeError") {
        setError(
          "Could not reach the server. Make sure the backend is running at http://localhost:3000."
        );
      } else {
        setError(err.message || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleActionChange = (newAction) => {
    setAction(newAction);
    setError("");
    setName("");
    setAge("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

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

              <form className="auth-form" onSubmit={handleSubmit}>
                {error && <div className="error">{error}</div>}

                <div className="field">
                  <label htmlFor="loginEmail">Email</label>
                  <input
                    id="loginEmail"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="field">
                  <label htmlFor="loginPassword">Password</label>
                  <input
                    id="loginPassword"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="primary-action"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Log In"}
                </button>

                <p className="switch-text">
                  Don’t have an account?{" "}
                  <button
                    type="button"
                    className="inline-link"
                    onClick={() => handleActionChange("Sign Up")}
                  >
                    Sign up
                  </button>
                </p>
              </form>
            </>
          ) : (
            <>
              <h1 className="auth-title">Create an account</h1>
              <p className="auth-subtitle">
                Sign up to start saving and organizing your Stash.
              </p>

              <form className="auth-form" onSubmit={handleSubmit}>
                {error && <div className="error">{error}</div>}

                <div className="field">
                  <label htmlFor="name">Name</label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="field">
                  <label htmlFor="age">Age</label>
                  <input
                    id="age"
                    type="text"
                    placeholder="Enter your age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>

                <div className="field">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="field">
                  <label htmlFor="password">Create password</label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="field">
                  <label htmlFor="confirmPassword">Confirm password</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="primary-action"
                  disabled={loading}
                >
                  {loading ? "Signing up..." : "Sign Up"}
                </button>

                <p className="switch-text">
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="inline-link"
                    onClick={() => handleActionChange("Log In")}
                  >
                    Log in
                  </button>
                </p>
              </form>
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
