import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router"
import { toast } from "react-toastify";
import axiosInstance from "../utils/axiosInstance";
import Loader from "../utils/Loader";


interface Notification {
    userId: string;
    message: string;
    isRead: boolean;
    _id: string;
  }

const Notification = () => {
const {notificationId} = useParams();
const[notificationAsRead, setNotificationAsRead] = useState<Notification | null>(null);
const[loading, setLoading] = useState(false);
const navigate = useNavigate();




const markNotificationAsRead = async () => {
    setLoading(true);
    console.log('markNotificationAsRead hit');
    
    try {
      const response = await axiosInstance.post(`${import.meta.env.VITE_API_BASE_URL}/api/notification/mark-notification-as-read`, {notificationId});
      if(response.data.success) {
        setNotificationAsRead(response.data.data);
        toast.success(response.data.message);
      }
    } catch (error: any) {
    if(error.response && (error.response.status === 400 || error.response.status === 404)) {
        toast.error(error.response.data.message);
      }
      else {
        toast.error("something went wrong! try again later");
        console.error(error);
      }
    };
    setLoading(false);
  };

useEffect(() => {
    markNotificationAsRead();
}, [])

  return (
    <section>
    {loading && <Loader />}
    <div className="h-[85vh] flex  items-center justify-center flex-col gap-y-2">
        <p className="text-4xl font-bold">Congratulation on Completion 🎉 🎉</p>
        <p className="text-2xl font-medium">{notificationAsRead?.message}</p>
         <p onClick={() => navigate(-1)} className="mx-auto px-6 py-3 text-white bg-blue-500 rounded-lg cursor-pointer hover:bg-blue-600 ">Go to previous page</p>
    </div>
    </section>
  )
}

export default Notification
