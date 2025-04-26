import { useSelector } from "react-redux";
import { RootState } from "../../store/Store";
import Loader from "../../utils/Loader";
import { useEffect, useState } from "react";
import { Course } from "../../types/dummyCoursesType";
import { toast } from "react-toastify";
import { UserType } from "../../types/UserType";
import axiosInstance from "../../utils/axiosInstance";

const GetEducatorCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const currency = useSelector((state: RootState) => state.currency.data);
  const [loading, setLoading] = useState(false);
  const storedUser = sessionStorage.getItem("user");
  const user: UserType = storedUser ? JSON.parse(storedUser) : null;

const getEducatorCourses = async () => {
  setLoading(true);
  try {
    const response = await axiosInstance.post(`${import.meta.env.VITE_API_BASE_URL}/api/educator/get-educator-courses`, {
      _id: user?._id});
      if(response.data.success) {
        setCourses(response.data.data.reverse());
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
  getEducatorCourses();
}
,[])

  return (
    <section>
      { loading && <Loader /> }
      <div className="h-screen flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
          <div className="w-full">
            <h2 className="text-lg font-medium pb-4">My Courses</h2>
            <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
            <table className="md:table-auto table-fixed w-full overflow-hidden">
              <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
        <tr>
          <th className="p-4 py-3 font-semibold truncate">All Students</th>
          <th className="p-4 py-3 font-semibold truncate">Earnings</th>
          <th className="p-4 py-3 font-semibold truncate">Students</th>
          <th className="p-4 py-3 font-semibold truncate">Published On</th>
        </tr>
      </thead>
      <tbody className="text-sm text-gray-500">
        {courses.map((course, index) => (
          <tr key={index} className="border-b border-gray-500/20">
            <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
            <img src={course.courseThumbnail} alt="course thumbnail" className="w-16"/>
            <span className="truncate hidden md:block">
            {course.courseTitle}
            </span>
            </td>
            <td className="px-4 py-3">{currency} {Math.floor(course.enrolledStudents.length * (course.coursePrice - course.discount * course.coursePrice / 100))}</td>
          <td className="px-4 py-3">{course.enrolledStudents.length}</td>
          <td className="px-4 py-3">{new Date(course.createdAt).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
              </table>
            </div>
          </div>
        </div>
    </section>
  );
};

export default GetEducatorCourses;
