import { useEffect, useState } from "react";
import Loader from "../../utils/Loader"
import { toast } from "react-toastify";
import { UserType } from "../../types/UserType";
import axiosInstance from "../../utils/axiosInstance";




interface GetStudentsEnrolled {
name: string;
courseTitle: string;
purchaseDate: string;
imageUrl: string
}
const GetEnrolledStudents = () => {

const [studentsEnrolled, setStudentsEnrolled] = useState<GetStudentsEnrolled[]>([]);
const [ loading, setLoading ] = useState(false);
const storedUser = sessionStorage.getItem("user");
  const user: UserType = storedUser ? JSON.parse(storedUser) : null;

const getStudentsEnrolled = async () => {
   setLoading(true);
   try {
    const response = await axiosInstance.post(`${import.meta.env.VITE_API_BASE_URL}/api/educator/get-enrolled-students`, 
      {_id: user?._id});
      if(response.data.success) {
        setStudentsEnrolled(response.data.data.reverse());
        toast.success(response.data.message)
      };
   } catch (error: any) {
    if(error.response && error.response.status === 400) {
      toast.error(error.response.message);
    }
    else {
      console.error(error);
      toast.error('something went wrong! try again later')
    }
  };
  setLoading(false)
};

useEffect(() => {
  getStudentsEnrolled();
}
,[])


  return (
    <section>
      { loading && <Loader /> }
<div className="min-h-screen flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
<div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
<table className="md:table-auto table-fixed w-full overflow-hidden pb-4">
    <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-center hidden sm:table-cell">#</th>
                    <th className="px-4 py-3 font-semibold">Student Name</th>
                    <th className="px-4 py-3 font-semibold">Course Title</th>
                    <th className="px-4 py-3 font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-500 text-sm">
                    {studentsEnrolled.map((student, index) => (
                      <tr key={index} className="border-b border-gray-500/20">
                        <td className="px-4 py-3 text-center hidden sm:table-cell">{index + 1}</td>
                        <td className="md:px-4 px-2 py-3 flex items-center space-x-3">
                          <img src={student.imageUrl} alt="student image" className="w-9 h-9 object-cover rounded-full"/> 
                          <span className="truncate">{student.name}</span> 
                        </td>
                        <td className="px-4 py-3 truncate">{student.courseTitle}</td>
                        <td className="px-4 py-3 hidden sm:table-cell">{new Date(student.purchaseDate).toLocaleDateString()}</td>
                      </tr>
                    ))}
                    </tbody>
    </table>
     </div>
    </div>
    </section>
  )
}

export default GetEnrolledStudents;
