import { useEffect, useState, useRef } from "react";
import uniqid from "uniqid";
import Quill from "quill";
import upload_image from "../../assets/upload_image.png";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { Chapter as BaseChapter } from "../../types/dummyCoursesType";
import Loader from "../../utils/Loader";
import { toast } from "react-toastify";
import { UserType } from "../../types/UserType";
import axiosInstance from "../../utils/axiosInstance";




type Chapter = BaseChapter & {
  isOpen: boolean;
};



const AddCourse = () => {
  const quillRef = useRef<Quill | null>(null);
  const editorRef = useRef<HTMLDivElement | null>(null); 

  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [coursePrice, setCoursePrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [image, setImage] = useState<File | null>(null);
  const [courseContent, setCourseContent] = useState<Chapter[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState("");
  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: "",
    lectureDuration: 0,
    lectureUrl: "",
    isPreviewFree: false,
  });
const [loading, setLoading] = useState(false);
const storedUser = sessionStorage.getItem("user");
  const user: UserType = storedUser ? JSON.parse(storedUser) : null;


const handleChapter = (action: string, chapterId: string | "") => {
if (action === "add") {
  const title = prompt("Enter chapter title");
  if (title) {
const newCourseContent = {
  chapterId: uniqid(),
  chapterOrder: courseContent.length > 0 ? courseContent.slice(-1)[0].chapterOrder + 1 : 1,
  isOpen: true,
  chapterTitle: title,
  chapterContent: [],
};
setCourseContent([...courseContent, newCourseContent]);
  }
} else if (action === "remove") {
  setCourseContent(courseContent.filter((chapter) => chapter.chapterId !== chapterId));
  }
  else if (action === "toggle") {
setCourseContent(courseContent.map((chapter) => (chapter.chapterId === chapterId ? { ...chapter, isOpen: !chapter.isOpen } : chapter)));
  }
};

const handleLecture = (action: string, chapterId: string, lectureIndex: number | null) => {
  if (action === "add") {
    setCurrentChapterId(chapterId);
    setShowPopup(true);
  } else if (action === "remove") {
    setCourseContent(courseContent.map((chapter) => {
    if(chapter.chapterId === chapterId && lectureIndex !== null) {
        chapter.chapterContent.splice(lectureIndex, 1);
      }
      return chapter;
  }));
  }
};

const addLecture = () => {
  setCourseContent(courseContent.map((chapter) => {
    if(chapter.chapterId === currentChapterId) {
      const newLecture = {
        ...lectureDetails,
        lectureId: uniqid(),
        lectureOrder: chapter.chapterContent.length > 0 ? chapter.chapterContent.slice(-1)[0].lectureOrder + 1 : 1,
      };
      chapter.chapterContent.push(newLecture);
    }
    return chapter;
  }));
  setShowPopup(false);
  setLectureDetails({
    lectureTitle: "",
    lectureDuration: 0,
    lectureUrl: "",
    isPreviewFree: false,
  });
};


const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);
  try {
    let photoUrl = null;
      if (image) {
        const uploadFormData = new FormData();
        uploadFormData.append("image", image);
        const photoUploadResponse = await axiosInstance.post(`${import.meta.env.VITE_API_BASE_URL}/api/upload/admin-image-upload`, uploadFormData);
        photoUrl = photoUploadResponse.data.data;
      }
    const response = await axiosInstance.post(`${import.meta.env.VITE_API_BASE_URL}/api/educator/add-course`,{
      _id:  user?._id,
      image: photoUrl,
      courseData: {
        courseTitle,
        courseDescription,
        coursePrice,
        discount,
        courseContent,
      }
    });
    if(response.data.success) {
      toast.success(response.data.message);
      setCourseTitle("");
      setCourseDescription("");
      quillRef.current?.setContents([]); // Clear Quill editor content
      setCoursePrice(0);
      setDiscount(0);
      setImage(null);
      setCourseContent([]);
    }
  } catch (error: any) {
    if(error.response && error.response.status === 400) {
     toast.error(error.response.message);
    }
    else{
    console.error(error);
    toast.error('error adding course! try again later')
    }
  };
  setLoading(false);
};

  useEffect(() => {
    //initialize quill only once
    /*Inside the useEffect hook, the code ensures Quill is initialized only once when the component is first rendered. The useEffect hook runs after the initial render (on mount).
The if (!quillRef.current && editorRef.current) check ensures that Quill is initialized only once. If quillRef.current is null (meaning Quill hasn't been initialized yet), the code initializes Quill. */
    /*useRef directly holds a reference to the DOM element without re-renders across component. Quill need a reference to a DOM element directly(quillRef is a reference that will store the Quill instance in above) also can't Re-initializing Quill so use useRef n useEffect so Quill is initialized only once . we can't Re-initializing Quill it can cause:
Toolbar duplication (e.g., two toolbars appearing)
Text formatting issues (applying styles twice)
Lost state (Quill might reset content on each re-initialization)
Fix: The if (!quillRef.current) condition ensures only one Quill instance exists, avoiding these issues.
editorRef is a reference to the <div> element in the JSX where Quill will be initialized (this is where the editor will render
 */
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
      });
       // Listen for text changes in the editor n save it in setCourseDescription
    quillRef.current.on("text-change", () => {
      setCourseDescription(quillRef.current?.root.innerHTML || "");
    });
    }
  }, []);
  
  
  return (
    <>
    { loading && <Loader />}
    <section className="overflow-scroll flex flex-col items-start justify-between h-screen md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md w-full text-gray-500">
        <div className="flex flex-col gap-1">
          <p>Course Title</p>
          <input
            type="text"
            placeholder="Enter course title"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            required
            className="outline-none border border-gray-500 md:py-2.5 rounded px-3 py-2"
          />
        </div>
        <div className="flex flex-col gap-1">
          <p>Course Description</p>
          <div ref={editorRef}></div>
          </div>
          <div className="flex items-center justify-between flex-wrap">
          <div className="flex flex-col gap-1">
          <p>Course Price</p>
          <input
            type="number"
            placeholder= "0"
            min={0}
            value={coursePrice}
            onChange={(e) => setCoursePrice(Number(e.target.value))}
            required
            className="outline-none border border-gray-500 py-2 md:py-2.5 w-28 rounded px-3"
          />
        </div>
        <div className="flex flex-col md:flex-row items-center gap-3">
          <p>Course Thumbnail</p>
          <label htmlFor="thumbnail" className="flex items-center gap-3">
            <img src={upload_image} alt="" className=" rounded h-10 w-10 object-cover cursor-pointer border border-blue-300" />
            <input 
            type="file" 
            id="thumbnail" 
            accept="image/*"
            onChange={(e) => {
              if (e.target.files) {
                setImage(e.target.files[0]);
              }}}
            hidden
            />
            <img src={image ? URL.createObjectURL(image) : undefined} alt="" 
            className="max-h-10"/>
          </label>
        </div>
            </div>
            
            <div className="flex flex-col gap-1">
          <p>Discount %</p>
          <input
            type="number"
            placeholder= "0"
            min={0}
            max={100}
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
            required
            className="outline-none border border-gray-500 py-2 md:py-2.5 w-28 rounded px-3"
          />
        </div>
        {/* adding courseContent */}
        <div>
          {
            courseContent.map((chapter, index) => (
           <div key={index} className="bg-white border rounded-lg mb-4">
           <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center">
              < IoIosArrowDropdownCircle
              onClick={() => handleChapter("toggle", chapter.chapterId)}
              className={`w-5 h-5 mr-2 cursor-pointer transition-all ${chapter.isOpen &&"-rotate-90"}`}/>
              <span className="font-semibold">{index + 1} {chapter.chapterTitle}</span>
              </div>
              <span className="text-gray-500">{chapter.chapterContent.length} Lectures</span>
              <span onClick={() => handleChapter("remove", chapter.chapterId)} className="cursor-pointer w-4">❌</span>
            </div>
            {
              chapter.isOpen && (
                <div className="p-4">
                  {chapter.chapterContent.map((lecture, lectureIndex) => (
                    <div key={lectureIndex} className="flex items-center justify-between mb-2">
                      <span>
                    {lectureIndex + 1} {lecture.lectureTitle} - {lecture.lectureDuration} mins - <a href={lecture.lectureUrl} target="_blank" className="text-cyan-500">Link</a> - {lecture.isPreviewFree ? "Free Preview" : "Paid"}
                      </span>
                      <span onClick={() => handleLecture("remove", chapter.chapterId, lectureIndex)} className="cursor-pointer w-4">❌</span>
                      </div>
                  ))}
                  <div onClick={() => handleLecture("add", chapter.chapterId, null )} className="inline-flex bg-gray-100 p-2 rounded cursor-pointer mt-2">+ Add Lecture</div>
                </div>
              )}
           </div>
            ))}
            <div onClick={() => handleChapter("add", "")} className="flex items-center justify-center p-2 cursor-pointer bg-blue-100 rounded-lg">
              + Add Chapter
              </div>
              {
                showPopup && (
                  <div className="fixed inset-0 flex items-center justify-center bg-gray-900 opacity-85">
                  <div className="bg-white text-gray-700 rounded p-4 relative w-full max-w-80">
                  <h2 className="text-lg font-semibold mb-4">Add Lecture</h2>
                  <div className="mb-2">
                  <p>Lecture Title</p>
                  <input 
                  type="text"
                  value={lectureDetails.lectureTitle} 
                  onChange={(e) => setLectureDetails({...lectureDetails, lectureTitle: e.target.value})}
                  className="mt-1 block w-full border rounded py-1 px-2" />
                    </div>
                    <div className="mb-2">
                  <p>Duration (minutes)</p>
                  <input 
                  type="number"
                  min={0}
                  value={lectureDetails.lectureDuration} 
                  onChange={(e) => setLectureDetails({...lectureDetails, lectureDuration: Number(e.target.value)})}
                  className="mt-1 block w-full border rounded py-1 px-2" />
                    </div>
                    <div className="mb-2">
                  <p>Lecture Url</p>
                  <input 
                  type="text"
                  value={lectureDetails.lectureUrl} 
                  onChange={(e) => setLectureDetails({...lectureDetails, lectureUrl: e.target.value})}
                  className="border border-gray-300 rounded w-full py-2 px-3" />
                    </div>
                    <div className="flex gap-2 my-4">
                    <p>Is Preview Free?</p>
                    <input 
                    type="checkbox"
                    checked={lectureDetails.isPreviewFree}
                    onChange={(e) => setLectureDetails({...lectureDetails, isPreviewFree: e.target.checked})}
                    className="mt-1 scale-125"
                    />
                      </div>
                      <button onClick={() => addLecture()} type="button" className="w-full bg-cyan-500 text-white py-2 px-4 rounded">Add</button>
                      <span className="absolute top-4 right-4 cursor-pointer w-4" onClick={() => setShowPopup(false)}>❌</span>
                  </div>
                  </div>
                )
              }
        </div>
        <button type="submit" className="bg-black text-white w-max py-2.5 px-8 rounded my-4 cursor-pointer">ADD</button>
      </form>
    </section>
    </>
  );
};

export default AddCourse;
