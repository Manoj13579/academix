import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';


const authenticateToken = (req:Request, res:Response, next:NextFunction) => {
    const { accessToken, refreshToken } = req.cookies;
    
    
    if(!accessToken) {
        res.status(404).json({ success: false, message: "accessToken not found"});
        return;
    };
    try {
      jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!, (err:Error | null, decoded:any) => {
        if(err) {
            res.status(401).json({ success: false, message: " authenticateToken unauthorized"});
            return;
        };
        // Request by Express does not include decoded type so req declared as any
        (req as any).decoded = decoded;
        next();
      })  
    } 
    catch (error) {
        console.log('authenticateToken', error); 
        res.status(500).json({ success: false, error });
        return;
    }
};


const authorizeAdmin = (req:Request, res:Response, next:NextFunction) => {
    
        if((req as any).decoded.role !== "admin") {
            res.status(403).json({ success: false, message: "Access Denied"});
            return;
        } ;
        next();
   
};

const authorizeUser = (req:Request, res:Response, next:NextFunction) => {

    if((req as any).decoded.role !== "user") {
       res.status(403).json({ success: false, message: "Access Denied"});
       return;
    };
    next();
    };



    export { authenticateToken, authorizeAdmin, authorizeUser};