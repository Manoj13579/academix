import mongoose, { Schema, Document, Model } from "mongoose";


export interface ICourseProgress extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    courseId: mongoose.Schema.Types.ObjectId;
    completed: boolean;
    lectureCompleted: string[];
};


const courseProgressSchema = new Schema({
userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
completed: { type: Boolean, default: false },
lectureCompleted: [],
}, { timestamps: true });

const CourseProgress: Model<ICourseProgress> = mongoose.model<ICourseProgress>("CourseProgress", courseProgressSchema);
export default CourseProgress;