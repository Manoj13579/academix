import mongoose, { Schema, Document, Model } from "mongoose";

// Interface for a Lecture
export interface ILecture {
    lectureId: string;
    lectureTitle: string;
    lectureDuration: number;
    lectureUrl: string;
    isPreviewFree: boolean;
    lectureOrder: number;
};

// Interface for a Chapter
export interface IChapter {
    chapterId: string;
    chapterOrder: number;
    chapterTitle: string;
    chapterContent: ILecture[];
};

// Interface for a Course Rating
export interface ICourseRating {
    userId: string;
    rating: number;
};


// Interface for a Course Document
export interface ICourse extends Document {
    courseTitle: string;
    courseDescription: string;
    courseThumbnail?: string;
    coursePrice: number;
    isPublished: boolean;
    discount: number;
    courseContent: IChapter[];
    courseRating: ICourseRating[];
    educator: mongoose.Types.ObjectId;
    enrolledStudents: mongoose.Types.ObjectId[];
};

// Lecture Schema
const lectureSchema = new Schema<ILecture>({
    lectureId: { type: String, required: true },
    lectureTitle: { type: String, required: true },
    lectureDuration: { type: Number, required: true },
    lectureUrl: { type: String, required: true },
    isPreviewFree: { type: Boolean, required: true },
    lectureOrder: { type: Number, required: true }
}, { _id: false });


// Chapter Schema
const chapterSchema = new Schema<IChapter>({
    chapterId: { type: String, required: true },
    chapterOrder: { type: Number, required: true },
    chapterTitle: { type: String, required: true },
    chapterContent: [lectureSchema]
}, 
// Don't provide _id. ID will be provided by uniqid from frontend to chapterId
{ _id: false });


// Course Schema
const courseSchema = new Schema<ICourse>({
    courseTitle: { type: String, required: true },
    courseDescription: { type: String, required: true },
    courseThumbnail: { type: String },
    coursePrice: { type: Number, required: true },
    isPublished: { type: Boolean, default: true },
    discount: { type: Number, required: true, min: 0, max: 100 },
    courseContent: [chapterSchema],
    courseRating: [
        {
            userId: { type: String, required: false },
            rating: { type: Number, required: false, min: 1, max: 5 }
        }
    ],
    educator: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
    enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users", required: false }]
}, { timestamps: true });


 // Course Model
const Course: Model<ICourse> = mongoose.model<ICourse>("Course", courseSchema);
export default Course;