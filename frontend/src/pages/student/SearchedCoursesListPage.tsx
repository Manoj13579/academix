import { useNavigate, useParams } from "react-router"
import SearchBar from "../../components/student/SearchBar";
import { useSelector } from "react-redux";
import { RootState } from "../../store/Store";
import CourseCard from "../../components/student/CourseCard";
import { RxCrossCircled } from "react-icons/rx";



const SearchedCoursesListPage = () => {

  const navigate = useNavigate();
  const {input} = useParams();
  const searchedInput = input || "";
  const allCourses = useSelector((state: RootState) => state.courses.data);
  const filteredCourses = allCourses.filter((course) => course.courseTitle.toLowerCase().includes(searchedInput.toLowerCase()));
 
 
 
  return (
    <>
  {filteredCourses?.length > 0 ? (
    <div className="relative md:px-36 px-8 pt-20 text-left mb-10">
    <div className="flex md:flex-row flex-col gap-6 items-start justify-between w-full">
    <div>
      <h1 className="text-4xl font-semibold text-gray-800">Course List</h1>
      <p className="text-gray-600"><span className="text-cyan-500 cursor-pointer" onClick={(() => navigate("/"))}>Home</span> / <span  className="text-cyan-500 cursor-pointer" onClick={(() => navigate("/course-list-page"))}>Courses List</span> / <span>Searched Courses List</span></p>
      </div>
      <SearchBar/>
    </div>
    
      <div className="inline-flex items-center gap-4 px-4 py-2 border mt-8 -mb-8 text-gray-600">
        <p>{input}</p>
        <RxCrossCircled onClick={() => navigate("/course-list-page")} className="cursor-pointer"/>
        </div>
    
    <div className="flex flex-wrap items-center justify-center gap-3">
      <CourseCard courses={filteredCourses} />
    </div>
    <div>
    </div>
    </div>): <p>No course found for: <span className="text-black">{searchedInput}</span></p>}
    </>
  )
}

export default SearchedCoursesListPage
