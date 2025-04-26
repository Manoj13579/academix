import express from 'express';
import { googleAuth, googleAuthCallback, googleLogout, userInfo } from '../controllers/googleAuthController';



const googleAuthRoutes = express.Router();


googleAuthRoutes.get('/auth/google', googleAuth);
googleAuthRoutes.get('/auth/google/callback', googleAuthCallback);
googleAuthRoutes.get('/login/success', userInfo,);
googleAuthRoutes.post('/googlelogout', googleLogout,);


export default googleAuthRoutes;