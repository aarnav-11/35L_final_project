import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../LoginSignup/Authentication.css";
import Background from "../../components/Background";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [favProf, setFavProf] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/auth/verify-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, age, favProf }),
      });
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      navigate(`/reset-password?token=${data.resetToken}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="mainMainBox">
      <Background />
      <div className="mainBox">
        <h1>Verify Identity</h1>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <label><h3>Email:</h3></label>
          <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
          <label><h3>Age:</h3></label>
          <input type="text" value={age} onChange={(e)=>setAge(e.target.value)} />
          <label><h3>Favorite Professor:</h3></label>
          <input type="text" value={favProf} onChange={(e)=>setFavProf(e.target.value)} />
          <button type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Continue"}
          </button>
        </form>
        <button className="secondaryBtn" onClick={() => navigate("/")}>
          Back to Login
        </button>
      </div>
    </div>
  );
}

export default ForgotPassword;
