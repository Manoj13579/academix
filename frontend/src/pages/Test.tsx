import axiosInstance from "../utils/axiosInstance";




const Test = () => {

const handleClick = async () => {
  try {
  const response = await axiosInstance.get(`${import.meta.env.VITE_API_BASE_URL}/api/auth/test`);
   console.log(response.data.message);
   
  } catch (error) {
    console.log(error);
    
  };
}
  return (
    <div>
      <button onClick={handleClick}>Test</button>
    </div>
  )
}

export default Test;
