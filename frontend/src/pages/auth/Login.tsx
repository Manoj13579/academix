import { useState } from 'react';
import { toast } from 'react-toastify';
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from 'react-router';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import axios from 'axios';
import { login } from '../../store/authSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/Store';




const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: ""});
    const [showPassword, setShowPassword] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
   

const navigate = useNavigate();
  

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setButtonDisabled(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, formData, { withCredentials: true });
      
      if(response.data.success) {
      dispatch(login(response.data.user));
      sessionStorage.setItem('user', JSON.stringify(response.data.user));
      setFormData({
        email: "",
        password: ""
        });
      toast.success("sucessfully logged in");
    navigate(response.data.user.role === "user" ? "/my-enrollments-page" : "/educator");
      }  
    } 
    catch (error: any) {
        if (error.response && error.response.status === 400 || error.response && error.response.status === 403) {
          toast.error(error.response.data.message)
        }
        else {
          toast.error("login failed try again later");
          console.log(error)
        }
      }
      setButtonDisabled(false);
  };
  const handleGoogleLogIn = async () => {
    console.log('handleGoogleLogIn hit');
    
      window.open(`${import.meta.env.VITE_API_BASE_URL}/api/auth/google`, '_self')
};
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  return (
    <section
      className="h-[90vh] flex items-center justify-center bg-fuchsia-500"
    >
      <form className="flex flex-col flex-wrap justify-center items-center gap-y-1 bg-fuchsia-800 p-8" onSubmit={handleSubmit}>
        <label htmlFor="email">
          <div className="flex items-center">
            <input
              id="email"
              className="placeholder:italic placeholder:text-gray-700 block bg-white h-10 w-60 md:w-96 border-2 border-slate-400 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-cyan-500 focus:ring-cyan-500 focus:ring-1 text-sm md:text-base text-gray-800"
              placeholder="Enter Email"
              required
              type="email"
              name="email"
              value= {formData.email}
              onChange= {(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
        </label>
        <label htmlFor="password" className="relative block">
          <div className="flex items-center">
            <input
              id="password"
              className="placeholder:italic placeholder:text-gray-700 block bg-white h-10 w-60 md:w-96 border-2 border-slate-400 rounded-md py-2 pl-9 pr-10 shadow-sm focus:outline-none focus:border-cyan-500 focus:ring-cyan-500 focus:ring-1 text-sm md:text-base text-gray-800"
              placeholder="Enter Password"
              required
              // Toggle between text and password
              type={showPassword ? 'text' : 'password'}
              name="password"
              value= {formData.password}
              onChange= {(e) => setFormData({...formData, password: e.target.value})}
            />
            {/* Toggle icon */}
            <span
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <AiFillEyeInvisible className="text-slate-500 h-6 w-6" />
              ) : (
                <AiFillEye className="text-slate-500 h-6 w-6" />
              )}
            </span>
          </div>
        </label>
        <button className='text-white font-semibold cursor-pointer hover:bg-fuchsia-950 rounded-md p-1' type='submit' disabled={buttonDisabled}>Log In</button>
        <p className='text-white underline cursor-pointer hover:bg-fuchsia-950 rounded-md p-1 disabled:bg-gray-400 disabled:cursor-not-allowed'>
          <Link to='/forgot-password'>Forgot Password</Link>
        </p>
        <p className='text-white'>-- or --</p>
        <button className='text-white font-semibold flex items-center justify-center gap-x-2 hover:bg-fuchsia-950 cursor-pointer rounded-md p-1' onClick={handleGoogleLogIn}>
          <FcGoogle />
          Log In with Google
        </button>
        <p className='text-white'>Don't have an Account? 
          <span className='text-white cursor-pointer hover:bg-fuchsia-950 rounded-md p-1 underline'>
            <Link to='/register'>Register</Link>
          </span>
        </p>
      </form>
    </section>
  );
};

export default Login;