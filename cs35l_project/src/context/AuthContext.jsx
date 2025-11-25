
import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const apiBaseUrl = "http://localhost:3000/api/auth";
export const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null); //to store user login data
    const [isAuthenticated, setIsAuthenticated] = useState(false); //to check if user is authenticated
    const [loading, setLoading] = useState(true); //to check if the auth status is still loading

    const navigate = useNavigate();

    const checkAuthStatus = async () => {
        try {
            const res = await fetch(`${apiBaseUrl}/me`, {
                credentials: "include", //send cookies with the request
            });

            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
                setIsAuthenticated(true);
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }
        } catch (err) {
            console.error("auth check failed:", err);
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };


    const signup = async (name, age, favProf, email, password) => {
        try {
            const res = await fetch(`${apiBaseUrl}/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, age, favProf, email, password }),
                credentials: "include",
            });

            if (!res.ok) {
                const errorMessage = await res.text();
                throw new Error(errorMessage);
            }

            const data = await res.json();
            setUser(data.user);
            setIsAuthenticated(true);
            navigate("/home");

        } catch (err) {
            console.error("signup error:", err.message);
            throw err;
        }
    };

    const login = async (email, password) => {
        try {
            const res = await fetch(`${apiBaseUrl}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
                credentials: "include",
            });

            if (!res.ok) {
                const errorMessage = await res.text();
                throw new Error(errorMessage);
            }

            const data = await res.json();
            setUser(data.user);
            setIsAuthenticated(true);
            navigate("/home");

        } catch (err) {
            console.error("login error:", err.message);
            throw err;
        }
    };

    const logout = async () => {
        try {
            await fetch(`${apiBaseUrl}/logout`, {
                method: "POST",
                credentials: "include",
            });

            setUser(null);
            setIsAuthenticated(false);
            navigate("/");
        } catch (err) {
            console.error("logout error:", err);
        }
    };

    useEffect(() => {
        checkAuthStatus(); //check if user is authenticated when the component starts
    }, []); //empty dependency array means this effect runs only once on mount

    return (
        <AuthContext.Provider
            value={{ user, isAuthenticated, loading, signup, login, logout }} //value is the data that is shared with the components
        >
            {children}
        </AuthContext.Provider>
    );
}
