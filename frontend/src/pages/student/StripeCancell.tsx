import { useEffect } from 'react'
import { useNavigate } from 'react-router';
import { toast } from "react-toastify";

const StripeCancel = () => {

const navigate = useNavigate();

  useEffect(() => {
    // toast needs a delay to show
    const timer = setTimeout(() => {
      toast.error("Payment canceled!", { autoClose: false, position: 'top-center' });
      navigate('/my-enrollments-page');

    }, 1000); // 1s delay
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div>
      cancelled
    </div>
  )
}

export default StripeCancel;