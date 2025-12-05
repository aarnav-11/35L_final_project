import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../LoginSignup/Authentication.css";
import Background from "../../components/Background";

function ResetPassword() {
    const navigate = useNavigate();
    const location = useLocation();
    const resetToken = new URLSearchParams(location.search).get("token");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
        }
        setLoading(true);
        try {
        const response = await fetch(
            "http://localhost:3000/api/auth/reset-password",
            {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ newPassword: password, resetToken }),
            }
        );
        if (!response.ok) throw new Error(await response.text());
        setMessage("Password updated! Redirecting to login...");
        setTimeout(() => navigate("/"), 2000);
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
            <h1>Reset Password</h1>
            {error && <div className="error">{error}</div>}
            {message && <div className="success">{message}</div>}
            <form onSubmit={handleSubmit}>
            <div className="authBody">
                <label>
                <h3>New Password:</h3>
                </label>
                <input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
                <label>
                <h3>Confirm Password:</h3>
                </label>
                <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </div>
            <div className="signButtons" style={{ justifyContent: "center" }}>
                <button type="submit" className="signButton" disabled={loading}>
                {loading ? "Updating..." : "Continue"}
                </button>
                <button
                type="button"
                className="signButton"
                onClick={() => navigate("/")}
                >
                Back to Login
                </button>
            </div>
            </form>
        </div>
        </div>
    );
}

export default ResetPassword;
