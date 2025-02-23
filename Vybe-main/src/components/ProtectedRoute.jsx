import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // ✅ Ensure correct path
import Loader from "./helper/Loader";

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <Loader/>;

    return user ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute; 
