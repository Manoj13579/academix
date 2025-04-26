import express, { Request, Response } from 'express';
import authRoutes from './authRoutes';
import uploadRoutes from './uploadRoutes';
import googleAuthRoutes from './googleAuthRoutes';
import educatorRoutes from './educatorRoutes';
import courseRoutes from './courseRoute';
import userRoutes from './userRoutes';
import notificationRoutes from './notificationRoutes';


const indexRouter = express.Router();

indexRouter.use('/api/auth', authRoutes);
indexRouter.use('/api', googleAuthRoutes);
indexRouter.use('/api/upload', uploadRoutes);
indexRouter.use('/api/educator', educatorRoutes);
indexRouter.use('/api/course', courseRoutes);
indexRouter.use('/api/user', userRoutes);
indexRouter.use('/api/notification', notificationRoutes);
indexRouter.get('/test', ((req: Request, res: Response) => {
    res.status(200).json({ success: true, message: "test success"});
}));


export default indexRouter;