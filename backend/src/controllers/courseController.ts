import { Request, Response } from "express";
import Course from "../models/Course";
import { IChapter, ILecture } from "../models/Course";


// get all courses. will return all published courses with  educator details populated.
export const getAllCourses = async (req: Request, res: Response) => {
    try {
        //.select[('-enrolledStudents', '-courseContent')] remove these from Course
        const courses = await Course.find({ isPublished: true }).select(['-enrolledStudents', '-courseContent']).populate('educator');
        res.status(200).json({ success: true, message: "Courses fetched successfully", data: courses });
        return;
    } catch (error) {
        console.error('getAllCourses error', error);
        res.status(500).json({ success: false, message: "Error fetching courses", error });
        return;
    }
};

// get course by id
export const getCourseById = async (req: Request, res: Response) => {
    const { _id } = req.body;
    if (!_id) {
        res.status(400).json({ success: false, message: "id required" });
        return;
    }
    try {
        const courseData = await Course.findById(_id).populate('educator');
    // remove lectureUrl if isPreviewFree is false
    // for each directly modifies courseData(array) so below condition will be assigned in courseData.
    courseData?.courseContent.forEach((chapter: IChapter) => {
        chapter.chapterContent.forEach((lecture: ILecture) => {
            if(!lecture.isPreviewFree) {
                lecture.lectureUrl = '';
            }
        })
    })

        res.status(200).json({ success: true, message: "Course fetched successfully", data: courseData });
        return;
    } catch (error) {
        console.error('getCourseById error', error);
        res.status(500).json({ success: false, message: "Error fetching course", error });
        return;
    }
};