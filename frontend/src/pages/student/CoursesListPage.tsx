import SearchBar from "../../components/student/SearchBar";
import CourseCard from "../../components/student/CourseCard";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/Store";
import { useEffect } from "react";
import { getCourses } from "../../store/coursesSlice";
import statusCode from "../../utils/statusCode";
import Loader from "../../utils/Loader";
import StatusError from "../../utils/StatusError";





const CoursesListPage = () => {
  const courses = useSelector((state: RootState) => state.courses.data);
  const status = useSelector((state: RootState) => state.courses.status);
  
const dispatch = useDispatch<AppDispatch>();
const navigate = useNavigate();

useEffect(()=> {
dispatch (getCourses());
}, []);

if (status === statusCode.LOADING) {
  return <Loader />;
}

if (status === statusCode.ERROR) {
  return <StatusError />
}
 
 
  return (
    <>
    <div className="relative md:px-36 px-8 pt-20 text-left mb-10">
    <div className="flex md:flex-row flex-col gap-6 items-start justify-between w-full">
    <div>
      <h1 className="text-4xl font-semibold text-gray-800">Course List</h1>
      <p className="text-gray-600"><span className="text-cyan-500 cursor-pointer" onClick={(() => navigate("/"))}>Home</span> / <span>Course List</span></p>
      </div>
      <SearchBar/>
    </div>
    
    
    <div className="flex flex-wrap items-center justify-center gap-3">
      <CourseCard courses={courses} />
    </div>
    <div>
    </div>
    </div>
    </>
  )
}

export default CoursesListPage
