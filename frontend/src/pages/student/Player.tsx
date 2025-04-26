import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { FaAngleDown, FaPlayCircle } from "react-icons/fa";
import { calculateChapterTime } from "../../utils/calculateTime";
import humanizeDuration from "humanize-duration";
import { TiTick } from "react-icons/ti";
import YouTube from "react-youtube";
import Rating from "../../components/student/Rating";
import { Course } from "../../types/dummyCoursesType";
import { toast } from "react-toastify";
import Loader from "../../utils/Loader";
import { UserType } from "../../types/UserType";
import axiosInstance from "../../utils/axiosInstance";
import uniqid from "uniqid";



interface chapterLectureIndex {
  chapter: number;
  lecture: number;
  lectureUrl: string;
  /*lectureTitle derive from ...lecture(hastype) coz playerData needs to have type for others n has type now all need to have type */
  lectureTitle: string;
  lectureId: string;
}
interface progressData {
  userId: string;
    courseId: string;
    completed: boolean;
    lectureCompleted: string[];
}
interface CourseRating {
  userId: string;
  rating: number;
}

const Player = () => {

  const{_id} = useParams();
 const [courseDetail, setCourseDetail] = useState<Course | null>(null);
   const [openSection, setOpenSection] = useState<Record<number, boolean>>({});
    const [playerData, setPlayerData] = useState<chapterLectureIndex | null>(null);
    const [progressData, setProgressData] = useState<progressData | null>(null);
    const [initialRating, setInitialRating] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const storedUser = sessionStorage.getItem("user");
      const user: UserType = storedUser ? JSON.parse(storedUser) : null;
    


   
    const userEnrolledCourses = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.post(`${import.meta.env.VITE_API_BASE_URL}/api/user/user-enrolled-courses`,  {
            _id: user?._id
          } );
        if(response.data.success) {
          // only get enrolled course that matches params. user may have multiple enrolled course
          const matchedCourse = response.data.data.find((course: Course) => course._id === _id);
          setCourseDetail(matchedCourse);
          // course will have rating from multiple user only get rating of this user
          matchedCourse.courseRating.map((item: CourseRating) => {
            if(item.userId === user?._id) {
              setInitialRating(item.rating);
            }
          })
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

    const markLectureAsCompleted  = async (lectureId: string) => {
      setLoading(true);
      try {
        const response = await axiosInstance.post(`${import.meta.env.VITE_API_BASE_URL}/api/user/update-user-course-progress`, 
          { userId: user?._id,
            courseId: _id,
            notificationId: uniqid(),
            lectureId
          }
         );
        if(response.data.success) {
          getUserCourseProgress();
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
    

    const getUserCourseProgress  = async () => {
      setLoading(true);
      try {
      
          const response = await axiosInstance.post(`${import.meta.env.VITE_API_BASE_URL}/api/user/get-user-course-progress`, 
            {userId: user?._id,
             courseId: _id
            });
            if(response.data.success) {
              setProgressData(response.data.data);
        }
      } catch (error: any) {
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

    const addUserRating  = async (rating: number) => {
      setLoading(true);
      try {
        const response = await axiosInstance.post(`${import.meta.env.VITE_API_BASE_URL}/api/user/add-user-rating`, 
          { userId: user?._id,
            courseId: _id,
            rating
          }
         );
        if(response.data.success) {
          userEnrolledCourses();
          toast.success(response.data.message);
        }
      } catch (error: any) {
      if(error.response && ( error.response.status === 400 || error.response.status === 404)) {
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
      userEnrolledCourses();
      getUserCourseProgress();
    }, []);
    



    const handleSectionToggle = (index: number) => {
      setOpenSection((prevOpenSection) => ({
      ...prevOpenSection, //keep previous course as it is
        [index]: !prevOpenSection[index],//set false for selected index or clicked courseContent
      }));
    }

  return (
    <section>
      {loading && <Loader />}
      <div className="p-4 sm:p-10 flex flex-col md:flex-row gap-10 md:px-36">
        {/* left column */}
        <div className="text-gray-800">
          <h2 className="text-2xl font-semibold">Course Structure</h2>
            <div className="pt-5">
                      {courseDetail?.courseContent.map((chapter, index) => (
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
                              {chapter.chapterContent.map((lecture, i) => (
                                <li key={i} className="flex items-center gap-2 py-1">
                                 {progressData && progressData.lectureCompleted.includes(lecture.lectureId) ? <TiTick className="w-3.5 h-3.5"/> : <FaPlayCircle className="w-3.5 h-3.5"/>}
                                 <div className="flex items-center justify-between w-full text-xs md:text-base text-gray-800">
                                  <p>{lecture.lectureTitle}</p>
                                  <div className="flex gap-2">
                                    {lecture.lectureUrl && <p className="text-cyan-600 cursor-pointer"
                                    onClick={() => setPlayerData({
                                      /* ...lecture gets type from courses. chapter, lecture are index+1 values n independent of courses so need type */
                                      ...lecture, chapter: index + 1, lecture: i + 1
                                    })}>
                                      Watch</p>}
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
                    <div className="flex items-center gap-2 py-3 mt-10">
                      <h1 className="text-xl font-bold">Rate this course:</h1>
                      < Rating initialRating={initialRating} onRating={addUserRating}/>
                    </div>
        </div>

        {/* right column */}
        <div className="md:mt-10">
        {playerData ? (
          <div>
            <YouTube videoId={playerData.lectureUrl.split("/").pop()} iframeClassName="w-full aspect-video" />
            <div className="flex items-center justify-between mt-1">
          <p>
            {/*  lectureTitle is derived from playerData so needs type */}
            {playerData.chapter}.{playerData.lecture} {playerData.lectureTitle}
          </p>
          <button className="text-cyan-600 cursor-pointer" onClick={() => markLectureAsCompleted(playerData.lectureId)}>{progressData && progressData.lectureCompleted.includes(playerData.lectureId) ? "Completed" : "Mark Complete"}</button>
        </div>
          </div>
        ):<img src={courseDetail?.courseThumbnail} alt="course thumbnail" className="w-full md:w-1/2" />
      }
        </div>
      </div>
    </section>
  )
}

export default Player;