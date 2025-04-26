import { useNavigate } from "react-router";
import { calculateCourseDuration, calculateNoOfLectures } from "../../utils/calculateTime";
import { Line } from "rc-progress";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import Loader from "../../utils/Loader";
import { Course } from "../../types/dummyCoursesType";
import { UserType } from "../../types/UserType";
import axiosInstance from "../../utils/axiosInstance";


interface Progress {
  lecturesCompleted: number;
  totalLectures: number;
}


const MyEnrollmentsPage = () => {

const navigate = useNavigate();

const [userEnrolledCourses, setUserEnrolledCourses] = useState<Course[]>([]);
const [progressArray, setProgressArray] = useState<Progress[]>([]);
const [ loading, setLoading ] = useState(false);
const storedUser = sessionStorage.getItem("user");
  const user: UserType = storedUser ? JSON.parse(storedUser) : null;



const getUserEnrolledCourses = async () => {
   setLoading(true);
   try {
    const response = await axiosInstance.post(`${import.meta.env.VITE_API_BASE_URL}/api/user/user-enrolled-courses`, 
      {_id: user?._id});
      if(response.data.success) {
        setUserEnrolledCourses(response.data.data);
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

const getUserCourseProgress  = async () => {
  setLoading(true);
  try {
    /* get progress for each course. Promise.all will wait for all promises to resolve. userEnrolledCourses.map(async will run for each course and make a request to the backend to get progress depending on how many courses user is enrolled. requests can be more than one. This is a super common pattern when you need to get data in parallel rather than one by one (which would be slower). Promise.all will throw an error n stop if any of the promises reject or any of backend request fails/throws an error. */
    const tempProgressArray = await Promise.all(userEnrolledCourses.map(async (course) => {
      const response = await axiosInstance.post(`${import.meta.env.VITE_API_BASE_URL}/api/user/get-user-course-progress`, 
        {userId: user?._id,
         courseId: course._id
        });
        let totalLectures = calculateNoOfLectures(course);
        const lecturesCompleted = response.data.data ? response.data.data.lectureCompleted.length : 0;
        return { lecturesCompleted, totalLectures };
    }));
    setProgressArray(tempProgressArray);

    }
   catch (error: any) {
  if(error.response && (error.response.status === 400 || error.response.status === 404)) {
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
  getUserEnrolledCourses();
}, []);

useEffect(() => {
  if(userEnrolledCourses.length > 0) {
    getUserCourseProgress();
  }
  /* once getUserEnrolledCourses fetches and sets the data, then only second effect should run and fetch progress for each course */
}, [userEnrolledCourses])

  return (
    <section>
      { loading && <Loader /> }
    <div className="md:px-36 px-8 pt-10">
    <h1 className="text-2xl font-semibold">My Enrollments</h1>
    <table className="md:table-auto table-fixed w-full overflow-hidden border mt-10">
      <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left max-sm:hidden">
        <tr>
          <th className="p-4 py-3 font-semibold truncate">Course</th>
          <th className="p-4 py-3 font-semibold truncate">Duration</th>
          <th className="p-4 py-3 font-semibold truncate">Completed</th>
          <th className="p-4 py-3 font-semibold truncate">Status</th>
        </tr>
      </thead>
      <tbody className="text-gray-700">
        {userEnrolledCourses.map((course, index) => (
          <tr key={index} className="border-b border-gray-500/20">
            <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3">
            <img src={course.courseThumbnail} alt="course thumbnail" className="w-14 sm:w-24 md:w-28"/>
            <div className="flex-1">
              <p className="mb-1 max-sm:text-sm">{course.courseTitle}</p>
              <Line strokeWidth={2} percent={progressArray[index] ? (progressArray[index].lecturesCompleted/ progressArray[index].totalLectures * 100) : 0} className="bg-gray-300 rounded-full"/>
            </div>
            </td>
            <td className="px-4 py-3 max-sm:hidden">{calculateCourseDuration(course)}</td>
          <td className="px-4 py-3 max-sm:hidden">{progressArray[index]&& `${progressArray[index].lecturesCompleted}/ ${progressArray[index].totalLectures}`} <span>Lectures</span></td>
            <td className="px-4 py-3 max-sm:text-right">
              <button onClick={() => navigate(`/player/${course._id}`)} className="px-3 sm:px-5 py-1.5 sm:py-2 bg-cyan-500 text-white max-sm:text-xs cursor-pointer">
                {progressArray[index]&& progressArray[index].lecturesCompleted/ progressArray[index].totalLectures === 1 ? "Completed" : "On Going"}</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
    </section>
  )
}

export default MyEnrollmentsPage
