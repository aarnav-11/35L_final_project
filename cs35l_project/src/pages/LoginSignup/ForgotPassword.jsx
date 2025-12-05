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
            const res = await fetch("http://localhost:3000/api/auth/verify-user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, age, favProf }),
            });
            if (!res.ok) throw new Error(await res.text());
            const data = await res.json();
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
                <div className="authBody">
                    <label><h3>Email:</h3></label>
                    <input type="email" placeholder="Enter your email" value={email} onChange={(e)=>setEmail(e.target.value)} />
                    
                    <label><h3>Age:</h3></label>
                    <input type="text" placeholder="Enter your age" value={age} onChange={(e)=>setAge(e.target.value)} />
                    
                    <label><h3>Favorite Professor:</h3></label>
                    <input type="text" placeholder="Enter your favorite professor" value={favProf} onChange={(e)=>setFavProf(e.target.value)} />
                </div>
                <div className="forgot-btns">
                    <button type="submit" className="forgotPrimary" disabled={loading}>
                        {loading ? "Verifying..." : "Continue"}
                    </button>
                    <button type="button" className="forgotSecondary" onClick={() => navigate("/")}>
                        Back to Login
                    </button>
                </div>
            </form>
        </div>
        </div>
    );
}

export default ForgotPassword;
