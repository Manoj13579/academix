import { Link, Outlet, useNavigate } from "react-router";
import { useState } from "react";
import logo from "../../assets/logo.png";
import { FaUserCircle } from "react-icons/fa";
import SideBar from "./SideBar";
import EducatorFooter from "./EducatorFooter";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/Store";
import { logout } from "../../store/authSlice";




const EducatorNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.data);

  const dispatch = useDispatch<AppDispatch>();

  
  const handleLogout = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/logout`, {}, { withCredentials: true});
      if(response.data.success) {
        dispatch(logout());
        sessionStorage.removeItem('user');
        navigate('/login');
      toast.success("successfully logged out");
      }
    } catch (error: any) {
      if(error.response && error.response.status === 400){
        toast.error(error.response.data.message)
      }
      else{
        toast.error('logout failed try again later');
        console.error(error);
      }
    }
  };

  return (
    <div>
      <nav className="flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 py-4 bg-fuchsia-950">
        <img src={logo} alt="logo" onClick={() => navigate("/")} className="w-28 lg:w-32 cursor-pointer" />

        {/* Desktop View */}
        <div className="hidden md:flex items-center gap-5 text-white">
          <div className="flex items-center gap-5">
            {
                user?.firstName ? <p>Hi! {user.firstName}</p> : <p>Hi! Educator</p>
            }
              <div className="relative">
                <button onClick={() => setMenuOpen(!menuOpen)}>
                {user?.image ? <img
      src={user.image}
      alt="user image"
      className="h-8 w-8 rounded-full cursor-pointer"/> :<FaUserCircle className="text-2xl cursor-pointer mt-1" />}
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg">
                    <Link to="/educator/admin-profile-edit" className="block px-4 py-2 hover:bg-gray-200">
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-200"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
          </div>
        </div>

        {/* Mobile View */}
        <div className="md:hidden flex items-center gap-2 sm:gap-5 text-white">
          <div className="flex items-center gap-1 sm:gap-2 max-sm:text-xs">
          {
                user?.firstName ? <p>Hi! {user.firstName}</p> : <p>Hi! Educator</p>
            }
            
              <div className="relative">
                <button onClick={() => setMenuOpen(!menuOpen)}>
                  <FaUserCircle className="text-2xl cursor-pointer mt-1" />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-lg shadow-lg">
                    <Link to="/profile" className="block px-4 py-2 hover:bg-gray-200">
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-200"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
          </div>
        </div>
      </nav>
      <div className="flex">
        <SideBar />
        <div className="flex-1">
      <Outlet />
        </div>
      </div>
        <EducatorFooter />
      </div>
  );
};

export default EducatorNavbar;