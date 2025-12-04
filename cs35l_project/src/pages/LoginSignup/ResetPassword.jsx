import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../LoginSignup/Authentication.css";
import Background from "../../components/Background";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const resetToken = new URLSearchParams(location.search).get("token");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch("http://localhost:3000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword: password, resetToken }),
      });
      if (!response.ok) throw new Error(await response.text());
      setMessage("Password updated! You may now log in.");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <div className="mainMainBox">
      <Background />
      <div className="mainBox">
        <h1>Reset Password</h1>
        {error && <div className="error">{error}</div>}
        {message && <div className="success">{message}</div>}
        <form onSubmit={handleSubmit}>
          <label><h3>New Password:</h3></label>
          <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
          <button type="submit">Reset Password</button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
