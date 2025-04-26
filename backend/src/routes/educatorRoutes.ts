import express from 'express';
import { addCourse, getEducatorCourses, getEducatorDashboardData, getEnrolledStudents, updateRoleToEducator } from '../controllers/educatorController';
import { authenticateToken, authorizeAdmin } from '../middlewares/authMiddleware';


const educatorRoutes = express.Router();


educatorRoutes.post('/update-role-to-educator', authenticateToken, updateRoleToEducator);
educatorRoutes.post('/add-course', authenticateToken, authorizeAdmin, addCourse);
educatorRoutes.post('/get-educator-courses', authenticateToken, authorizeAdmin, getEducatorCourses);
educatorRoutes.post('/get-educator-dashboard-data', authenticateToken, authorizeAdmin, getEducatorDashboardData);
educatorRoutes.post('/get-enrolled-students', authenticateToken, authorizeAdmin, getEnrolledStudents);


export default educatorRoutes;