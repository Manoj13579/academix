import { useEffect } from 'react'
import { useNavigate } from 'react-router';
import { toast } from "react-toastify";

const StripeCancel = () => {

const navigate = useNavigate();

  useEffect(() => {
    // toast needs a delay to show
    const timer = setTimeout(() => {
      toast.error("Payment canceled!");
      navigate('/my-enrollments-page');

    }, 100); // 1s delay
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div>
      success
    </div>
  )
}

export default StripeCancel;