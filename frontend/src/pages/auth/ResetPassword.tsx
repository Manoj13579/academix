import axios from 'axios';
import { useRef, useState } from 'react';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';



const ResetPassword = () => {

    const [formData, setFormData] = useState({
      verificationCode: "",
      email: "",
      password: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const inputRef = useRef(null);
    const navigate = useNavigate();
   
    
    

  


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
          const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/reset-password`, { formData });
          if(response.data.success) {
            toast.success(response.data.message, { autoClose: false, position: 'top-center' });
            navigate('/login');
          }
        } catch (error: any) {
          if(error.response && (error.response.status === 403 || error.response.status === 404)) {
            toast.error(error.response.data.message);
          }
          else {
            console.error(error);
            toast.error('cannot reset password! try again later')
          }
        }
      };

    
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
      };

  return (
    <section className="h-[90vh] flex items-center justify-center flex-col bg-fuchsia-500">
        <p className="text-gray-100 text-2xl font-bold ">Reset Password</p>
     <form className="flex flex-col flex-wrap justify-center items-center gap-y-2 bg-fuchsia-800 p-8" onSubmit={handleSubmit}>
     <label htmlFor="verification-code">
          <div className="flex items-center">
            <input
              id="verification-code"
              className="placeholder:italic placeholder:text-gray-700 block bg-white h-10  w-60 md:w-96 border-2 border-slate-400 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-cyan-500 focus:ring-cyan-500 focus:ring-1 text-sm md:text-base text-gray-800"
              placeholder="Enter Code"
              required
             ref= {inputRef}
              autoFocus
              type="text"
              name="verification-code"
              value={formData.verificationCode}
              onChange={(e) => setFormData({...formData, verificationCode: e.target.value})}
            />
          </div>
        </label>
        <label htmlFor="email">
          <div className="flex items-center">
            <input
              id="email"
              className="placeholder:italic placeholder:text-gray-700 block bg-white h-10  w-60 md:w-96 border-2 border-slate-400 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-cyan-500 focus:ring-cyan-500 focus:ring-1 text-sm md:text-base text-gray-800"
              placeholder="Enter Email"
              required
              type="email"
              name="email"
              value={formData.email}
              onChange = {(e) => setFormData({...formData, email: e.target.value})}
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
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
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
        <button className= 'text-white cursor-pointer font-semibold bg-cyan-500 hover:bg-cyan-700 rounded-md p-1 disabled:bg-gray-400 disabled:cursor-not-allowed' type='submit'>Submit</button>
        </form>
    </section>
  )
}

export default ResetPassword;