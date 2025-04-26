import express, { Response, Request } from 'express';
import { adminProfileEdit, deleteUser, forgotPassword, 
    getAllUsers, login, logout, refreshRequest,
    register, resendVerificationCode, resetPassword, 
    userProfileEdit,
    verificationCode, } from '../controllers/authController';
import { authenticateToken, authorizeAdmin } from '../middlewares/authMiddleware';
import eitherAuthMiddleware from '../middlewares/eitherAuthMiddleware';

const authRoutes = express.Router();


authRoutes.post('/register', register);
authRoutes.post('/login', login);
authRoutes.post('/refresh-request', refreshRequest);
authRoutes.post('/logout', logout);
authRoutes.post('/verification-code', verificationCode);
authRoutes.post('/resend-verification-code', resendVerificationCode);
authRoutes.post('/forgot-password', forgotPassword);
authRoutes.post('/reset-password', resetPassword);
authRoutes.get('/all-users', authenticateToken, authorizeAdmin, getAllUsers);
authRoutes.delete('/delete-user', authenticateToken, authorizeAdmin, deleteUser);
authRoutes.post('/admin-profile-edit', authenticateToken, authorizeAdmin, adminProfileEdit);
authRoutes.post('/user-profile-edit', authenticateToken, userProfileEdit);
authRoutes.get('/test', eitherAuthMiddleware, ((req: Request, res: Response) => {res.status(200).json({ success: true, message: "test user either"});
 return;
}
));

export default authRoutes;