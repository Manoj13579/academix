import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import axios from 'axios';
import Loader from '../../utils/Loader';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/Store';
import { login } from '../../store/authSlice';


const GoogleLoginSuccess = () => {

  const[loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  
  const fetchUserData = async () => {
    
    
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/login/success`, { withCredentials: true });
      if (response.data.success) {
        const { email, firstName, role, _id, createdAt, updatedAt, authProvider, photo, enrolledCourses } = response.data.user;
        dispatch(login(response.data.user));
        sessionStorage.setItem("user", JSON.stringify({
          email, 
          firstName, 
          role, 
          _id,
          image: photo, 
          createdAt, 
          updatedAt,
          authProvider,
          enrolledCourses
        }));
        toast.success("Successfully logged in");
          navigate('/my-enrollments-page');
      }
    } catch (error) {
      toast.error('An error occurred in login try again');
      console.error(error);
    }
    setLoading(false);
  };
  
  
  useEffect(() => {
  fetchUserData();
}, []);
  // Render a loading message while processing
  if (loading) {
    return (
      <Loader />
    );
  }

  // Render nothing as the user will be redirected
  return null;
};

export default GoogleLoginSuccess;