import star from "../../assets/star.png"
import { useSelector } from "react-redux";
import { RootState } from "../../store/Store";
import { Link } from "react-router";
import { calculateRating } from "../../utils/calculateRating";
import blank_star from "../../assets/blank_star.png";
import { Course } from "../../types/dummyCoursesType";

interface CourseCardProps {
  courses: Course[]
}
 
const CourseCard = ({courses}: CourseCardProps) => {
 
  const currency = useSelector((state: RootState) => state.currency.data);
  
  return (
  <section className="flex flex-wrap items-center justify-center gap-4">
      {courses.map((course) =>(
        <div key={course._id} className="w-60 bg-white shadow-custom-card-shadow rounded-lg overflow-hidden">
       <Link to={"/course-detail-page/" + course._id} onClick={() => scrollTo(0, 0)}>
       <img src={course.courseThumbnail} alt="course thumbnail" className="w-full h-40 object-cover"/>
       <div className="p-3 text-left">
         <h3 className="text-base font-semibold">{course.courseTitle}</h3>
        <p >{course.educator.firstName}</p>
         <div className="flex items-center space-x-2">
          <p>{calculateRating(course)}</p>
           <div className="flex">
             {[...Array(5)].map((_, index) => (
               <img key={index} src={ index < Math.floor(calculateRating(course)) ? star : blank_star} alt="star icon" className="w-3.5 h-3.5"/>
             ))}
           </div>
           <p>({course.courseRating.length})</p>
            </div>
            <p className="text-base font-semibold text-gray-800"
            >{currency}{(course.coursePrice - course.discount * course.coursePrice/100).toFixed(2)}</p>
       </div>
     </Link>
     </div>
      ))
   }
    </section>
  )
}

export default CourseCard
