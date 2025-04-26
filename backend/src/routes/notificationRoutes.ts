import express from 'express';
import { deleteNotification, getAllNotifications, markNotificationAsRead } from '../controllers/notificationController';
import eitherAuthMiddleware from '../middlewares/eitherAuthMiddleware';




const notificationRoutes = express.Router();


notificationRoutes.post('/mark-notification-as-read', eitherAuthMiddleware , markNotificationAsRead);
notificationRoutes.get('/get-all-notifications/:_id', eitherAuthMiddleware,  getAllNotifications);
notificationRoutes.delete('/delete-notification/:notificationId', eitherAuthMiddleware,  deleteNotification);

export default notificationRoutes;