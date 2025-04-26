import passport from 'passport';
import { Strategy as OAuth2Strategy } from 'passport-google-oauth2';
import Users from '../models/users';
import { Request, Response } from 'express';




passport.use(new OAuth2Strategy({
       
    clientID: process.env.GOOGLE_AUTH_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET!,
    
    scope: ['profile', 'email'],
    /* same url listed in google console for redirect. when google redirects to this url call callback mentioned below tells passport wher it will get data after successfull login. it invokes googleAuthCallback then. */
    callbackURL: 'http://localhost:5000/api/auth/google/callback',
    
},

async (accessToken, refreshToken, profile, done) => {

    try {
        // First, find if a user with the same Google ID exists
        let user = await Users.findOne({ googleId: profile.id, authProvider: 'google' });
        
        if (user) {
            // If the user already exists, return the user
            return done(null, user);
                                  } 
             else {
                // If no user exists, create a new one
                const newUser = new Users({
                    googleId: profile.id,
                    firstName: profile.displayName,
                    email: profile.emails[0].value,
                    photo: profile.photos[0].value,
                    authProvider: 'google',
                });
                await newUser.save();
                done(null, newUser);
            }
        }
     catch (error) {
        done(error);
    }
}));

// store user.id in session
passport.serializeUser((user:any, done) => {
    
    done(null, user.id);
});
// Retrieve the user object from the database using the user.id
passport.deserializeUser(async (id, done) => {
   
    
    try {
        const user = await Users.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});


export const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

/* after google redirects this invoked which invokes above callbackUR and async (accessToken run then successRedirect continues. cors will only stop request from browser with get. post etc. redirects are allowed by cors. redirects are seen as request from server too */
export const googleAuthCallback = passport.authenticate('google', {

            successRedirect: (`${process.env.FRONTEND_URL}/google-login-success`),
            failureRedirect: (`${process.env.FRONTEND_URL}/login)`)
        });


export const userInfo = (req:Request, res:Response) => {
   
    const user = req.user as any;
    const { password, ...sanitizedUser } = user.toObject ? user.toObject() : user;
    
    if(req.user) {
        
       res.status(200).json({success: true, message: "successfully logged in", user: sanitizedUser});
       return;
    }
    else {
       res.status(400).json({success: false, message: "Not Authorized"});
       return;
    }
}



export const googleLogout = (req:Request, res:Response) => {
    
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to log out' });
      }
  
    (req.session as any) = null;
      res.clearCookie('connect.sid');
      res.send({
        success: true,
        isAuth: req.isAuthenticated()
      })})}

  

export default passport;