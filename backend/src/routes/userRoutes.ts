import express from 'express';
import { addUserRating, getUserCourseProgress, getUserData, purchaseCourse, updateUserCourseProgress, userEnrolledCourses } from '../controllers/userController';
import { authenticateToken } from '../middlewares/authMiddleware';
import eitherAuthMiddleware from '../middlewares/eitherAuthMiddleware';




const userRoutes = express.Router();


userRoutes.get('/get-user-data', authenticateToken,  getUserData);
userRoutes.post('/user-enrolled-courses', eitherAuthMiddleware, userEnrolledCourses);
userRoutes.post('/purchase-course', eitherAuthMiddleware, purchaseCourse);
userRoutes.post('/update-user-course-progress', eitherAuthMiddleware, updateUserCourseProgress)
userRoutes.post('/get-user-course-progress', eitherAuthMiddleware, getUserCourseProgress);
userRoutes.post('/add-user-rating', eitherAuthMiddleware, addUserRating);

export default userRoutes;