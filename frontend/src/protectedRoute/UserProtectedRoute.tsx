import { useEffect } from "react";
import { Navigate, Outlet } from "react-router";
import { toast } from "react-toastify";
import { UserType } from "../types/UserType";

const UserProtectedRoute = () => {
    const storedUser = sessionStorage.getItem("user");
    const user: UserType = storedUser ? JSON.parse(storedUser) : null;
    

    // useEfect only used for displaying toast
    useEffect(() => {
        if (!user) {
            toast.warn('You must login first');
        }
    }, []);

    if (user?.role === 'user') {
        return <Outlet />;
    } else {
        return <Navigate to='/login' />;
    }
};

export default UserProtectedRoute;