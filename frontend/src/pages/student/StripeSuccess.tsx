import { useEffect } from 'react'
import { useNavigate } from 'react-router';
import { toast } from "react-toastify";

const StripeSuccess = () => {

const navigate = useNavigate();

  useEffect(() => {
    // toast needs a delay to show
    const timer = setTimeout(() => {
      toast.success("Payment successful!", { autoClose: false, position: 'top-center' });
      navigate('/my-enrollments-page');

    }, 1000); // 1s delay
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div>
    </div>
  )
}

export default StripeSuccess;