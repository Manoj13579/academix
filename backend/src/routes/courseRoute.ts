import express from 'express';
import { getAllCourses, getCourseById } from '../controllers/courseController';



const courseRoutes = express.Router();


courseRoutes.get('/get-all-courses',  getAllCourses);
courseRoutes.post('/get-course-by-id',  getCourseById);

export default courseRoutes;