import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const apiBaseUrl = "http://localhost:3000/api/auth";
export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // store user login data
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // auth status still loading?

  const navigate = useNavigate();

  const checkAuthStatus = async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/me`, {
        credentials: "include",
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

  // simplified signup: only name, age, email, password are required from the UI
  const signup = async (name, age, email, password) => {
    try {
      const res = await fetch(`${apiBaseUrl}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          age,
          email,
          password,
          favProf: null, // keep field for backend compatibility
        }),
        credentials: "include",
      });

      if (!res.ok) {
        const errorMessage = await res.text();
        throw new Error(errorMessage || "Signup failed.");
      }

      const data = await res.json();
      setUser(data.user);
      setIsAuthenticated(true);
      navigate("/home");
    } catch (err) {
      console.error("signup error:", err);
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
        throw new Error(errorMessage || "Login failed.");
      }

      const data = await res.json();
      setUser(data.user);
      setIsAuthenticated(true);
      navigate("/home");
    } catch (err) {
      console.error("login error:", err);
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
    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, signup, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
