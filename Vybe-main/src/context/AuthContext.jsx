import { createContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios"; 
import Cookies from "js-cookie"; 

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const hasNavigated = useRef(false); 

    useEffect(() => {
        const token = Cookies.get("token");
        if (!token) {
            console.log("No token found, skipping auth check.");
            setLoading(false);
            return;
        }

        const checkAuth = async () => {
            try {
                const res = await api.get("/user", { withCredentials: true });
                console.log("Authenticated User:", res.data);
                if (res.data) {
                    setUser(res.data.user);
                    navigate("/home");
                }
            } catch (error) {
                console.error("Auth check failed:", error);
                setUser(null);

                if (!hasNavigated.current) {
                    hasNavigated.current = true;
                    navigate("/");
                }
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []); 

    
    const login = async (email, password) => {
        try {
            const res = await api.post("/login", { emailId: email, password }, { withCredentials: true });
            console.log("Login Response:", res);
            setUser(res.data.data);
            navigate("/home");
        } catch (error) {
            console.error("Login failed:", error);
            throw new Error(error.response?.data?.message || "Login failed. Try again!");
        }
    };

    const signup = async (userData) => {
        try {
            const res = await api.post("/signup", userData, { withCredentials: true });

            console.log("Signup Response:", res);

            setUser(res.data.data); 
            navigate("/home");
            setTimeout(() => navigate("/home"), 100);
        } catch (error) {
            console.error("Signup failed:", error);
            throw new Error(error.response?.data?.message || "Signup failed. Try again!");
        }
    };

    const logout = async () => {
        try {
            await api.post("/logout", {}, { withCredentials: true });
            setUser(null);
            console.log("User logged out");
            navigate("/");
            setTimeout(() => window.location.reload(), 100);
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user,signup, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
