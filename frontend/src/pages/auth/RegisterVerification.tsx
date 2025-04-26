import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";

const RegisterVerification = () => {

  
  const params = useParams();
  const user_id = params.id;
  const [verificationCode, setVerificationCode] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setButtonDisabled(true);
        try {
          // withCredentials: true needed to set cookies in application
          const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/verification-code`, {
            _id: user_id,
            verificationCode,
          }, {withCredentials: true});
          if(response.data.success) {
            sessionStorage.setItem('user', JSON.stringify(response.data.user));
            navigate(response.data.user.role === "user" ? "/my-enrollments-page" : "/educator");
            toast.success(response.data.message);
          };
        } catch (error: any) {
          if(error.response && (error.response.status === 400 || error.response.status === 403 || error.response.status === 404)){
            toast.error(error.response.data.message);
          }
          else{
            toast.error("error in verification! try again");
            console.error(error);
            
          }
        };
      setButtonDisabled(false);
      };

const handleResendCode = async () => {
  setButtonDisabled(true);
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/resend-verification-code`,{ _id: user_id });
    if(response.data.success) {
      toast.success(response.data.message, { autoClose: false, position: 'top-center' });
    }
  } catch (error: any) {
    if(error.response && (error.response.status === 400 || error.response.status === 403 || error.response.status === 404)) {
      toast.error(error.response.data.message)
    }
    else{
      toast.error("error in resending code! try again");
            console.error(error);
    }
  };
  setButtonDisabled(false);
}

  return (
    <section className="h-screen flex items-center justify-center flex-col bg-fuchsia-500 gap-1">
        <p className="text-gray-100 text-2xl font-bold ">Verify Code</p>
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
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
          </div>
        </label>
        <button className= 'text-white font-semibold bg-cyan-500 hover:bg-cyan-700 cursor-pointer rounded-md p-1 disabled:bg-gray-400 disabled:cursor-not-allowed' type='submit' disabled={buttonDisabled}>Submit</button>
        <button onClick={handleResendCode} className= 'text-white font-semibold bg-cyan-500 hover:bg-cyan-700 cursor-pointer rounded-md p-1 disabled:bg-gray-400 disabled:cursor-not-allowed' disabled={buttonDisabled}>Resend code</button>
        </form>
    </section>
  )
}

export default RegisterVerification;