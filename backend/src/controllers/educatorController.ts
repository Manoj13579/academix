import { Request, Response } from "express";
import Users from "../models/users";
import Course from "../models/Course";
import Purchase from "../models/Purchase";


export const updateRoleToEducator = async (req: Request, res: Response) => {
   const { _id } = req.body;
   if(!_id) {
    res.status(400).json({ success: false, message: "id required"});
    return;
   };

    try {
        await Users.findByIdAndUpdate(_id, { role: "admin" }, { new: true });
        res.status(200).json({ success: true, message: "You can publish a course now"});
        return;
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating role", error});
        return;
    }
};


export const addCourse = async (req: Request, res: Response) => {
    const { _id, image, courseData } = req.body;
    if(!_id || !courseData || !image) {
        res.status(400).json({ success: false, message: "all fields required"});
        return;
       };

    try {
        const newCourse = new Course({
        courseThumbnail: image,
         educator: _id,
         ...courseData
        });
        await newCourse.save();
        res.status(201).json({ success: true, message: "Course created successfully", data: newCourse });
        return;
    } catch (error) {
        console.error('addCourse error', error);
        res.status(500).json({ success: false, error });
        return;
    }
};

export const getEducatorCourses = async (req: Request, res: Response) => {
  const{_id} = req.body;
  if(!_id) {
    res.status(400).json({ success: false, message: "id required"});
    return;
   };

  try {
    const educatorCourses = await Course.find({ educator: _id });
    res.status(200).json({ success: true, message: "Courses fetched successfully", data: educatorCourses });
    return;
  } catch (error) {
    console.error('getEducatorCourses error', error);
    res.status(500).json({ success: false, message: "Error fetching courses", error });
    return;
};
};

// get educator's dashboard data ( total earnings, totalenrolled students, no. of courses )
export const getEducatorDashboardData = async (req: Request, res: Response) => {
    const {_id} = req.body;
    if(!_id) {
        res.status(400).json({ success: false, message: "id required"});
        return;
       };

    try {
       const courses = await Course.find({ educator: _id });
      const totalCourses = courses.length;

      const courseIds = courses.map((course) => course._id);

      // calculate total earnings from purchases from the educator's all courses.
       // array of completed purchases related to the educator's courses.
     const purchases = await Purchase.find({ 
        /* courseId field in each Purchase document should match any of the values in the courseIds array. $in is a MongoDB operator that checks if the value of the field (in this case, courseId) is present in the array provided (courseIds).  $in looks for a match in the array of courseIds not a single value. since find in mongoose can return more than one document, it returns an array of documents that match the query */
        courseId: { $in: courseIds },
        status: "completed"
      });

      const totalEarnings = purchases.reduce((total, purchase) => total + purchase.amount, 0);

      // collect unique enrolled student ids with their course titles
      const enrolledStudentsData: { courseTitle: string, student: any }[] = [];
      for(const course of courses) {
        //It queries the Users model and retrieves the firstName and photo fields for enrolled students in the course.
          const students = await Users.find({ _id: { $in: course.enrolledStudents } }, 'firstName photo');
          students.forEach((student) => {
              enrolledStudentsData.push({
                courseTitle: course.courseTitle,
                student
              });
          })
      };

      res.status(200).json({
        success: true,
        message: "Dashboard data fetched successfully",
        data: {
            totalEarnings,
            enrolledStudentsData,
            totalCourses
        }
    });
 } catch (error) {
        console.error('getEducatorDashboardData error', error);
        res.status(500).json({ success: false, message: "Error fetching dashboard data", error });
        return;
    }
};

// get enrolled students data with purchase data
export const getEnrolledStudents = async (req: Request, res: Response) => {
  const{_id} = req.body;
  if(!_id) {
    res.status(400).json({ success: false, message: "id required"});
    return;
   };

  try {
    const courses = await Course.find({ educator: _id });
    const courseIds = courses.map((course) => course._id);
    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed"
    }).populate('userId', 'firstName photo').populate('courseId', 'courseTitle');

    const enrolledStudents = purchases.map((purchase) => ({
      name: (purchase.userId as any).firstName,
      courseTitle: (purchase.courseId as any).courseTitle,
      purchaseDate: purchase.createdAt,
      imageUrl: (purchase.userId as any).photo
    }));

    res.status(200).json({ success: true, message: "Enrolled students fetched successfully", data: enrolledStudents });
    return;
  } catch (error) {
    console.error('getEnrolledStudents error', error);
    res.status(500).json({ success: false, message: "Error fetching enrolled students", error });
    return;
  }
};