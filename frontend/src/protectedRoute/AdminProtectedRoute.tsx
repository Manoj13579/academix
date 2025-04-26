import { useEffect } from "react";
import { Navigate, Outlet } from "react-router";
import { toast } from "react-toastify";
import { UserType } from "../types/UserType";

const AdminProtectedRoute = () => {
    const storedUser = sessionStorage.getItem("user");
    const user: UserType = storedUser ? JSON.parse(storedUser) : null;
    
    useEffect(() => {
        if (!user) {
            toast.warn('You must login first');
        }
    }, []);

    if (user?.role === 'admin') {
        return <Outlet />;
    } else {
        return <Navigate to='/login' />;
    }
};

export default AdminProtectedRoute;