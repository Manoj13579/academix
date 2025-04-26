import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import axios from "axios";




const ForgotPassword = () => {


const[email, setEmail] = useState("");
const[buttonDisabled, setButtonDisabled] = useState(false);
const navigate = useNavigate();


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setButtonDisabled(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/forgot-password`, { email });
      if(response.data.success) {
      toast.success(response.data.message, { autoClose: false, position: 'top-center' });
      navigate('/reset-password')
      }
    } catch (error: any) {
      if(error.response && (error.response.status === 403 || error.response.status === 404)){
      toast.error(error.response.data.message);
      }
      else {
        toast.error('cannot send verification code! try again later');
        console.error(error);
      }
    };
    setButtonDisabled(false);
  };
  return (
    <section className="h-screen flex items-center justify-center flex-col bg-fuchsia-500">
        <p className="text-gray-100 text-2xl font-bold ">Reset Password</p>
     <form className="flex flex-col flex-wrap justify-center items-center gap-y-2 bg-fuchsia-800 p-8" onSubmit={handleSubmit}>
        <label htmlFor="email">
          <div className="flex items-center">
            <input
              id="email"
              className="placeholder:italic placeholder:text-gray-700 block bg-white h-10  w-60 md:w-96 border-2 border-slate-400 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-cyan-500 focus:ring-cyan-500 focus:ring-1 text-sm md:text-base text-gray-800"
              placeholder="Enter Email"
              required
              type="email"
              name="email"
              value={email}
              onChange = {(e) => setEmail(e.target.value)}
            />
          </div>
        </label>
        <button className= 'text-white font-semibold bg-cyan-500 hover:bg-cyan-700 cursor-pointer rounded-md p-1 disabled:bg-gray-400 disabled:cursor-not-allowed' type='submit' disabled={buttonDisabled}>Submit</button>
        </form>
    </section>
  )
}

export default ForgotPassword;