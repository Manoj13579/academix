import { Link, useNavigate } from "react-router";


const NotFound = () => {

const navigate = useNavigate();

  return (
    <div className=" h-screen flex text-center justify-center flex-col gap-6 bg-gray-100">
         <h1 className="text-6xl font-bold text-red-600">404</h1>
      <p className="text-xl text-gray-700">Sorry, Page Not Found!</p>
     <p className="mx-auto px-6 py-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600 "> <Link to='/'>Go back to home</Link></p>
      <p onClick={() => navigate(-1)} className="mx-auto px-6 py-3 text-white bg-blue-500 rounded-lg cursor-pointer hover:bg-blue-600 ">Go to previous page</p>
    </div>
  )
}

export default NotFound;