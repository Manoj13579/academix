import { useSelector } from "react-redux";
import { RootState } from "../../store/Store";
import Loader from "../../utils/Loader";
import { BsCashStack } from "react-icons/bs";
import { GoBook } from "react-icons/go";
import { PiStudentFill } from "react-icons/pi";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { UserType } from "../../types/UserType";
import axiosInstance from "../../utils/axiosInstance";


interface EnrolledStudentsData {
  courseTitle: string;
  student: {
    firstName: string;
    photo: string;
  };
}

interface EducatorDashboardDataType {
  totalCourses: number;
  totalEarnings: number;
  enrolledStudentsData: EnrolledStudentsData[];
}

const GetEducatorDashboardData = () => {

  const [educatorDashboardData, setEducatorDashboardData] = useState<EducatorDashboardDataType | null>(null);
  const [loading, setLoading] = useState(false);
  const currency = useSelector((state: RootState) => state.currency.data);
  const storedUser = sessionStorage.getItem("user");
  const user: UserType = storedUser ? JSON.parse(storedUser) : null;

  
  const getEducatorDashboardData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(`${import.meta.env.VITE_API_BASE_URL}/api/educator/get-educator-dashboard-data`, {
        _id: user?._id});
        if(response.data.success) {
          setEducatorDashboardData(response.data.data);
          toast.success(response.data.message);
        }
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
  
  useEffect( () => {
    getEducatorDashboardData();
  }
  ,[])
 
  return (
    <section>
      { loading && <Loader />}
        <div className="flex flex-col items-start justify-between gap-8 md:p-8 md:pb-0 p-4 pt-8 ps-0">
          <div className="space-y-5">
            <div className="flex flex-wrap gap-5 items-center ">
              <div className="flex items-center gap-3 shadow-custom-card-shadow border border-blue-500 p-4 w-56 rounded-md">
                <PiStudentFill className="text-blue-500 h-8 w-8"/>
                <div>
                  <p className="text-2xl font-medium text-gray-600">
                    {educatorDashboardData?.enrolledStudentsData?.length}
                  </p>
                  <p className="text-base text-gray-500">Enrolled Students</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shadow-custom-card-shadow border border-blue-500 p-4 w-56 rounded-md">
                <GoBook className="text-blue-500 h-6 w-6"/>
                <div>
                  <p className="text-2xl font-medium text-gray-600">
                    {educatorDashboardData?.totalCourses}
                  </p>
                <p className="text-base text-gray-500">Total Courses</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shadow-custom-card-shadow border border-blue-500 p-4 w-56 rounded-md">
              < BsCashStack className="text-blue-500 h-6 w-6"/>
                <div>
                  <p className="text-2xl font-medium text-gray-600">
                  {currency}  {educatorDashboardData?.totalEarnings.toFixed(2)}
                  </p>
                  <p className="text-base text-gray-500">Total Earnings</p>
                </div>
              </div>
            </div>
            <div>
              <h2 className="pb-4 text-lg font-medium">Latest Enrollments</h2>
              <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
              <table className="md:table-auto table-fixed w-full overflow-hidden">
                  <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-center hidden sm:table-cell">#</th>
                    <th className="px-4 py-3 font-semibold">Student Name</th>
                    <th className="px-4 py-3 font-semibold">Course Title</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700 text-sm">
                    {educatorDashboardData?.enrolledStudentsData.map((course, index) => (
                      <tr key={index} className="border-b border-gray-500/20">
                        <td className="px-4 py-3 text-center hidden sm:table-cell">{index + 1}</td>
                        <td className="md:px-4 px-2 py-3 flex items-center space-x-3">
                          <img src={course.student.photo} alt="student image" className="w-9 h-9 object-cover rounded-full"/> 
                          <span className="truncate">{course.student.firstName}</span> 
                        </td>
                        <td className="px-4 py-3 truncate">{course.courseTitle}</td>
                      </tr>
                    ))}
                    </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
    </section>
  );
};

export default GetEducatorDashboardData;
