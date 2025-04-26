import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { RootState } from "../../store/Store";
import Loader from "../../utils/Loader";
import { calculateRating } from "../../utils/calculateRating";
import blank_star from "../../assets/blank_star.png";
import star from "../../assets/star.png";
import { calculateChapterTime } from "../../utils/calculateTime";
import { calculateCourseDuration } from "../../utils/calculateTime";
import { calculateNoOfLectures } from "../../utils/calculateTime";
import { FaAngleDown, FaPlayCircle, FaRegClock } from "react-icons/fa";
import { GoBook } from "react-icons/go";
import humanizeDuration from "humanize-duration";
import YouTube from "react-youtube";
import axios from "axios";
import { toast } from "react-toastify";
import { Course } from "../../types/dummyCoursesType";
import { UserType } from "../../types/UserType";
import axiosInstance from "../../utils/axiosInstance";





const CourseDetailPage = () => {
  // object will store index(number): true/false(boolean) of chapters inside courseContent.map.
  /* initially object in openSection will be empty so false when handleSectionToggle(index) clicked particular chapter with the clicked index becomes true so it will be open */
  const[openSection, setOpenSection] = useState<Record<number, boolean>>({});
  const[isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);

  /* playerData will store videoId of particular chapter in object form of videoId: string. initially it will be empty here with "" n will get videoId: string when handleSectionToggle(index) clicked . so type will be {videoId: string} | ""*/
  const[playerData, setPlayerData] = useState<{videoId: string} | "">("");
  const{_id} = useParams();
  const currency = useSelector((state: RootState) => state.currency.data);
  const [courseDetail, setCourseDetail] = useState<Course | null>(null);
  const [loading, setLoading] = useState(false);
  const storedUser = sessionStorage.getItem("user");
  const user: UserType = storedUser ? JSON.parse(storedUser) : null;


const getCourseById = async () => {
  setLoading(true);
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/course/get-course-by-id`,  {_id} );
    if(response.data.success) {
      setCourseDetail(response.data.data);
      toast.success(response.data.message);
    }
  } catch (error: any) {
    if(error.response && error.response.status === 400) {
      toast.error(error.response.data.message);
    }
    else {
      toast.error("something went wrong! try again later");
      console.error(error);
    }
  };
  setLoading(false);
};

const purchaseCourse = async () => {
  if(isAlreadyEnrolled) {
    toast.warn("You are already enrolled in this course!");
    return;
  }
  setLoading(true);
  try {
    const response = await axiosInstance.post(`${import.meta.env.VITE_API_BASE_URL}/api/user/purchase-course`,  {
      courseId:_id,
      _id: user?._id
    } );
    if(response.data.success) {
      const {session_url} = response.data;
      window.location.replace(session_url);
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
  getCourseById();
}, []);


useEffect(() => {
  if(user?.role === "user" && courseDetail) {
    setIsAlreadyEnrolled(user?.enrolledCourses.includes(courseDetail._id));
  }
}, [courseDetail]); // courseDetail takes time to get data


  const handleSectionToggle = (index: number) => {
    setOpenSection((prevOpenSection) => ({
    ...prevOpenSection, //keep previous course as it is
      [index]: !prevOpenSection[index],//set false for selected index or clicked courseContent
    }));
  }

  return (
    <section>
      { loading && <Loader /> }
      { courseDetail &&
    <div className="flex md:flex-row  flex-col-reverse gap-10 relative  items-start justify-between md:px-36 px-8 md:pt-30 pt-20 text-left bg-gradient-to-b from-fuchsia-500 to-fuchsia-800">
     {/* left column */}
     <div className="max-w-xl z-10 text-gray-200">
     <h1 className="md:text-course-details-heading-large text-course-details-heading-small text-gray-50 font-semibold">{courseDetail.courseTitle}</h1>
     {/* to hide html tags like <p>, <div> etc. from string using dangerouslySetInnerHTML.dangerouslySetInnerHTML is used to set a string of HTML content directly into the DOM in React. It allows you to inject raw HTML (as a string) into a React component, bypassing React’s usual JSX rendering mechanism. never use it high security risk */}
     <p className="pt-4 md:text-base text-sm" 
     dangerouslySetInnerHTML={{__html: courseDetail.courseDescription.slice(0, 200)}}></p>
     {/* reviiew rating */}
  <div className="flex items-center space-x-2 pt-3 pb-1 text-sm">
          <p>{calculateRating(courseDetail)}</p>
           <div className="flex">
             {[...Array(5)].map((_, index) => (
               <img key={index} src={ index < Math.floor(calculateRating(courseDetail)) ? star : blank_star} alt="star icon" className="w-3.5 h-3.5"/>
             ))}
           </div>
           <p className="text-cyan-200">({courseDetail.courseRating.length}{courseDetail.courseRating.length === 1 ? " Review" : " Reviews"})</p>
            <p>{courseDetail.enrolledStudents.length} {courseDetail.enrolledStudents.length === 1 ? "Student Enrolled" : "Students Enrolled"}</p>
            </div>
          <p className="text-sm">Course by <span className="text-cyan-200 underline">{courseDetail.educator.firstName}</span></p>
            <div className="pt-8 text-gray-800">
              <h2 className="text-xl font-semibold">Course Structure</h2>
            <div className="pt-5">
            {courseDetail.courseContent.map((chapter, index) => (
              <div key={index} className="border border-gray-300 bg-white mb-2 rounded">
                <div onClick={() => handleSectionToggle(index)} className="flex items-center justify-between px-4 py-3 cursor-pointer select-none">
                  <div className="flex items-center gap-2">
                  <FaAngleDown className={`transform transition-transform ${openSection[index] ? " rotate-180" : ""}`} />
                  <p className="font-medium md:text-base text-sm">{chapter.chapterTitle}</p>
                    </div>
                    <p className="text-sm md:text-base">{chapter.chapterContent.length} lectures-
                    {calculateChapterTime(chapter)}</p>
                </div>
              <div className={`overflow-hidden transition-all duration-300 ${openSection[index] ? "max-h-96" : "max-h-0"}`}>
                  <ul className="list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300">
                    {chapter.chapterContent.map((lecture, index) => (
                      <li key={index} className="flex items-center gap-2 py-1">
                       <FaPlayCircle className="w-3.5 h-3.5"/>
                       <div className="flex items-center justify-between w-full text-xs md:text-base text-gray-800">
                        <p>{lecture.lectureTitle}</p>
                        <div className="flex gap-2">
                          {lecture.isPreviewFree && <p className="text-cyan-600 cursor-pointer"
                          onClick={() => setPlayerData({
                            /* lecture.lectureUrl is of type string given this type in Course[]. here || '' is used to handle the case where lecture.lectureUrl is empty/undefined. typescript complains that since videoId is of type string(can be undefined too in case lecture.lectureUrl is empty), undefined cannot be assigned to string*/
                            videoId: lecture.lectureUrl.split('/').pop() || '',
                          })}>
                            Preview</p>}
                          <p>{humanizeDuration(lecture.lectureDuration * 60 * 1000, {units: ["h", "m"]})}</p>
                        </div>
                       </div>
                      </li>
                    ))}
                  </ul>
                  </div>
                </div>
            ))}
            </div>
            </div>
           <div className="py-20 text:sm md:text-base">
          <h3 className="text-xl font-semibold text-gray-50">Course Description</h3>
          <p className="pt-3" 
     dangerouslySetInnerHTML={{__html: courseDetail.courseDescription}}></p>
           </div>
     </div>

      {/* right column */}
    <div className="max-w-course-card-width z-10 shadow-custom-card-shadow rounded-t md:rounded-none overflow-hidden bg-white min-w-[300px] sm:min-w-[420px]">
      {
        playerData ? <YouTube videoId={playerData.videoId} opts={{playerVars: 
          {autoplay: 1}}} iframeClassName="w-full aspect-video"/>
        : <img src={courseDetail.courseThumbnail} alt="course thumbnail"/>
      }
      <div className="p-5">
      <div className="flex items-center gap-2">
        <FaRegClock className="text-red-600" />
      <p className="text-red-600"><span className="font-medium">5 days</span> left at this price</p>
      </div>
      <div className="flex gap-3 items-center pt-2">
        <p className="text-gray-800 text-2xl md:text-4xl font-semibold">{currency} {(courseDetail.coursePrice - courseDetail.discount * courseDetail.coursePrice/100).toFixed(2)}</p>
      <p className="text-gray-500 line-through md:text-lg">{currency} {courseDetail.coursePrice}</p>
      <p className="text-gray-500 md:text-lg">{courseDetail.discount}% off</p>
      </div>

      <div className="flex items-center gap-4 text-sm md:text-base pt-2 md:pt-4 text-gray-500">
      <div className="flex items-center gap-1">
        <img src={star} alt="star icon" className="w-3.5 h-3.5"/>
        <p>{calculateRating(courseDetail)}</p>
      </div>

      <div className="h-4 w-px bg-gray-500/40"></div>
      <div className="flex items-center gap-1">
      <FaRegClock className="text-gray-600" />
        <p>{calculateCourseDuration(courseDetail)}</p>
      </div>

      <div className="h-4 w-px bg-gray-500/40"></div>
      <div className="flex items-center gap-1">
      <GoBook className="text-gray-600" />
        <p>{calculateNoOfLectures(courseDetail)} lessons</p>
      </div>
      </div>
      <button onClick={purchaseCourse} className="mt-4 md:mt-6 w-full py-3 rounded bg-cyan-500 text-white cursor-pointer font-medium">{isAlreadyEnrolled ? "Already Enrolled" : "Enroll Now"}</button>

      <div className="pt-6">
        <p className="md:text-xl text-lg font-medium text-gray-800">What's in the course?</p>
        <ul className="ml-4 pt-2 text-sm md:text-base list-disc text-gray-500">
          <li>life time access with free updates</li>
          <li>certificate of completion</li>
          <li>Downloadable resources and source code</li>
          <li>access on any device</li>
          <li>learn at your own pace</li>
        </ul>
      </div>
      </div>
      </div>
    </div>}
    </section>
  )
}

export default CourseDetailPage
