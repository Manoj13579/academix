import Users from "../models/users";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import generateTokensAndSetCookies from "../middlewares/generateTokensAndSetCookies";
import { sendVerificationEmail, sendWelcomeEmail } from "../middlewares/sendEmail/email";
import { Request, Response } from "express";



const register = async (req:Request, res:Response) => {
  const { firstName, lastName, email, password, role, image: photo } = req.body.updatedFormData;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  // Validate password using regex
  if (!passwordRegex.test(password)) {
    res.status(400).json({ success: false,
      message: 'Password must contain at least one lowercase letter, one uppercase letter, one number, and be at least 8 characters long.',
    });
    return;
}

  try {
    if (!firstName || !lastName || !email || !password || !role) {
      res
        .status(400)
        .json({ success: false, message: "All fields required" });
      return;
    }
    let existingUser = await Users.findOne({ email, authProvider: "jwt" });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
      return;
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();// random 6 digit

    const newUser = new Users({ firstName, lastName,
      role,
      email,
      password: hashedPassword,
       authProvider: "jwt",
       photo,
      verificationCode,
      verificationCodeExpiresAt:Date.now() + 1 * 60 * 60 * 1000, //1 hour
     });
    await newUser.save();
    await sendVerificationEmail(newUser.email, verificationCode);
    res.status(201).json({
      success: true,
      message: "verification code has been sent to your email. Please enter the code to verify your account.",
      _id: newUser._id
    });
    return;
  } catch (error) {
    console.error('register error', error);
    res.status(500).json({ success: false, error });
    return;
  }
};


const verificationCode = async (req:Request, res:Response) => {
    
  const { verificationCode, _id }=req.body;
  if(!verificationCode) {
    res.status(404).json({success:false,message:"verification code not found"});
    return;
  } 
  try {
    /* this is efficient quering. findOne looks for one user with the given id and looks for verificationCodeExpiresAt which is greater than current time. if not found then it returns null which means !user.  */
    const user= await Users.findOne({
      _id,
      verificationCodeExpiresAt:{$gt:Date.now()}
    })
    if(user?.lockVerificationCodeUntil && user.lockVerificationCodeUntil.getTime() >= Date.now()) {
      res.status(403).json({ success: false, message: "Maximum resend attempts reached, try again later" });
      return;
    }
    if (!user) {
      res.status(404).json({success:false,message:"user not found or code expired"});
      return;
      
    };
    if (user.verificationCode !== verificationCode) {
      user.verificationCodeAttempts += 1;
     // Lock the account if attempts exceed the maximum limit
    if (user.verificationCodeAttempts >= 3) {
      /* Date.now() returns current date and time in milleseconds which is number. it's good to save in date format so new Date() used. getTime() used to change this date in milliseconds so it can be compared here in above*/
      user.lockVerificationCodeUntil = new Date(Date.now() + 24 * 60 * 60 * 1000); // Lock for 1 day
      user.verificationCodeAttempts = 0; // Reset verificationCodeAttempts after locking
    }
   await user.save();
      res.status(400).json({success:false,message:"Inavlid or Expired Code"});
      return;
      
    };
   user.isVerified=true;
   user.verificationCode=undefined; // Reset verificationCodeAttempts after successfully verified
   user.verificationCodeExpiresAt=undefined;
   /*Reset verificationCodeAttempts after successfully verified.locked only in continous verificationResendAttempts failure in resendVerificationCode function */
   user.verificationResendAttempts=0;
 const verifiedUser =  await user.save();
 
   await sendWelcomeEmail(verifiedUser.email,verifiedUser.firstName);
   await generateTokensAndSetCookies(
    verifiedUser,
    res
  ); 
   res.status(200).json({success:true,
    message:"Email Verifed Successfully",
    user: {
      firstName: verifiedUser.firstName,
      email: verifiedUser.email,
      role: verifiedUser.role,
      authProvider: "jwt",
      _id: user._id,
      image: verifiedUser.photo,
    }
  });
  return;  
  } catch (error) {
    console.error('verificationCode', error);
    res.status(500).json({ success:false, error });
    return;
  }
};



const resendVerificationCode = async (req:Request, res:Response) => {
    
  const { _id } = req.body;
  try {
      const user = await Users.findById(_id);
      if (!user) {
          res.status(404).json({ success: false, message: "User not found" });
          return;
      }
      if (user.isVerified) {
          res.status(400).json({ success: false, message: "You are already verified" });
          return;
      }

      // Check if the user is in the lock period
      if (user.lockVerificationResendUntil && user.lockVerificationResendUntil.getDate() >= Date.now()) {
          res.status(403).json({ success: false, message: "Maximum resend attempts reached, try again later" });
          return;
      }

      if (user.verificationResendAttempts >= 3) {
          user.lockVerificationResendUntil = new Date(Date.now() + 24 * 60 * 60 * 1000); // Lock for 1 day
          user.verificationResendAttempts = 0;// Reset verificationCodeAttempts after locking
          await user.save();
          res.status(403).json({ success: false, message: "Maximum resend attempts reached" });
          return;
      }

      const newVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      user.verificationCode = newVerificationCode;
      user.verificationCodeExpiresAt = new Date (Date.now() + 1 * 60 * 60 * 1000); // 1 hour expiration
      user.verificationResendAttempts += 1;

      await user.save();
      await sendVerificationEmail(user.email, newVerificationCode);

      res.status(200).json({
          success: true,
          message: "New verification code sent to your email",
      });
      return;
  } catch (error) {
      console.error("resendVerificationCode error", error);
      res.status(500).json({ success: false, error });
      return
  }
};




const login = async (req:Request, res:Response) => {
  const { email, password} = req.body;
  
  if (!email || !password) {
    res
      .status(400)
      .json({ success: false, message: "All fields required" });
      return;
  }
  try {
    const user = await Users.findOne({ email, authProvider: "jwt" });
    if (!user) {
      res
        .status(403)
        .json({ success: false, message: "Wrong email or password" });
        return;
    }
    if(!user.isVerified){
      res
        .status(403)
        .json({ success: false, message: "email not verified" });
        return;
    }
    if(user.lockLoginUntil && user.lockLoginUntil.getTime() >= Date.now()){
      res
        .status(403)
        .json({ success: false, message: "Account Locked! try again later" });
        return
    }
  const comparePass = await bcrypt.compare(password, user.password ?? "");
    if (!comparePass) {
      // increment login attempts
      user.loginAttempts += 1;
      // Lock the account if attempts exceed the maximum limit
      if (user.loginAttempts >= 6) {
        user.lockLoginUntil = new Date(Date.now() + 24 * 60 * 60 * 1000); // Lock for 1 day
        user.loginAttempts = 0; // Reset login attempts after locking
      };
     await user.save();
      res.status(403)
        .json({ success: false, message: "Wrong email or password" });
        return;
    };

    user.loginAttempts= 0;//on continous login failure lock, sucessful login will reset loginAttempts
     await user.save();
 await generateTokensAndSetCookies(
      user,
      res
    );
    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      /* like this mongodb won't pass _id by default but if entire user passed or like res in adminProfileEdit _id is passed by default */
      user: {
        firstName: user.firstName,
        email: user.email,
        role: user.role,
        authProvider: "jwt",
        _id: user._id,
        image: user.photo,
        enrolledCourses: user.enrolledCourses
      }
    });
    return;
  } catch (error) {
    res.status(500).json({ success: false, error });
    return;
  }
};




const forgotPassword = async (req:Request, res:Response) => {
  const {email} = req.body;
  try {
    const user = await Users.findOne({ email });
    if(!user) {
    res.status(404).json({ success: false, message: 'user not found'});
    return;
    };
    if(!user.isVerified){
      res
        .status(403)
        .json({ success: false, message: "email not verified" });
        return;
    };
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();// random 6 digit
    user.verificationCode = verificationCode
    await user.save();
    await sendVerificationEmail(user.email, verificationCode);
    res.status(201).json({
      success: true,
      message: "verification code has been sent to your email.",
    });
    return;
  } catch (error) {
    res.status(500).json({ success:false, error });
    return;
  }
  };
  
 
  
  const resetPassword = async (req:Request, res:Response) => {
  const {verificationCode, email, password} = req.body.formData;
  
  
  if(!verificationCode || !email || !password) {
   res.status(403).json({ success: false, message: 'all fields required' });
   return;
  };
  try {
    const user = await Users.findOne({ email });
    if (!user) {
      res.status(404).json({ success: false, message: 'user not found'});
      return;
    };
    // Check if the account is currently locked
    if (user.lockResetPasswordUntil && user.lockResetPasswordUntil.getTime() >= Date.now()) {
      res
        .status(403)
        .json({ success: false, message: "Account is locked. Please try again later." });
        return;
    };
    if(verificationCode !== user.verificationCode) {
      // Increment attempts
      user.resetPasswordAttempts += 1;
      // Lock the account if attempts exceed the maximum limit
      if(user.resetPasswordAttempts >= 3) {
        user.lockResetPasswordUntil = new Date(Date.now() + 24 * 60 * 60 * 1000); // Lock for 1 day
        user.resetPasswordAttempts = 0; // Reset resetPasswordAttempts after locking
      }
      await user.save();
      res.status(404).json({ success: false, message: 'invalid verification code'});
      return;
    };
    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Update the user's password
    user.password = hashedPassword;
    user.resetPasswordAttempts = 0; // Reset esetPasswordAttempts after successful password reset
    await user.save();
    res.status(200).json({ success: true, message: "Password reset successfully" });
  return;
  } catch (error) {
    res.status(500).json({ success:false, error });
    return;
  }
  };
  



const refreshRequest = async (req:Request, res:Response) => {
  const { refreshToken } = req.cookies;
 
  try {
    if (!refreshToken) {
      res.status(400).json({ success: false, message: "no refreshToken" });
      return;
    }

    const user = await Users.findOne({ refreshToken });
    if (!user) {
     res.status(400).json({ success: false, message: "invalid user" });
      return;
    }
// decoded is not a Mongoose object, but rather a plain object with JWT payload.
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!,
      async (err:Error | null, decoded: any) => {
        console.log('refreshRequest', decoded);
        if (err) {
          res.status(403).json({ success: false, message: "insufficient permission" });
          return;
        }
       // Now retrieve the user using the decoded payload. more secure than passing user
       
       const refreshedUser = await Users.findById(decoded._id); // Use decoded id
      
       if (!refreshedUser) {
         res.status(403).json({ success: false, message: "User not found" });
         return;
       }

       await generateTokensAndSetCookies(
         refreshedUser, // Pass the full user instance here
         res
       );

        res.status(200).json({
          success: true,
          message: "new accessToken generated",
        });
        return
      }
    );
  } 
  catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error });
    return;
  }
};



const logout = async (req:Request, res:Response) => {
  
  const { refreshToken } = req.cookies;
  
  
  if(!refreshToken) {
   res.status(400).json({ success: false, message: "refreshToken not found"});
   return;
  }
    try {
      await Users.findOneAndUpdate({ refreshToken }, { refreshToken: null });
      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", 
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        path: '/'
      });
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", 
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        path: '/'
      });
        res.status(200).json({ success: true, message: "successfully logged out" });
        return;
    } 
    catch (error) {
      res.status(500).json({ success: false, error });
      return;
    }
  };



const getAllUsers = async (req:Request, res:Response) => {
  try {
    const data = await Users.find();
    res.status(200).json({ success: true, message: 'Users fetched successfully', data});
    return;
  } catch (error) {
     res.status(500).json({ success: false, error });
     return 
  }
};

const deleteUser = async (req:Request, res:Response) => {
  const {_id} = req.body;
  if(!_id) {
   res.status(400).json({ success: false, message: "id required"});
   return;
  };
  try {
    await Users.findByIdAndDelete(_id);
    res.status(200).json({ success: true, message: "user successfully deleted"});
    return;
  } catch (error) {
    res.status(500).json({ success: false, error});
    return;
  }
};

const adminProfileEdit = async (req:Request, res:Response) => {
  
  const {adminId: _id, email, password, image: photo} = req.body;
  
  if (!_id) {
    res.status(400).json({ success: false, message: "Unauthorized Request" });
    return;
  }

  try {
    /** 
     * Hash the password before updating if it is provided
     */
    let updateData = { email, photo, password };
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      updateData.password = hashedPassword;
    }

    const data = await Users.findByIdAndUpdate(
      _id,
      updateData,
      { new: true }
    );

    if (!data) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    } else {
      const { password, refreshToken, lastName, googleId,  isVerified, loginAttempts,
        resetPasswordAttempts, verificationCodeAttempts, verificationResendAttempts, ...sanitizedData } = data.toObject();
      res.status(200).json({ success: true, message: "Profile updated successfully", data: sanitizedData });
      return;
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating profile", error });
    return;
  }
};

const userProfileEdit = async (req:Request, res:Response) => {
  
  const {userId: _id, password, image: photo} = req.body;
  
  if (!_id) {
    res.status(400).json({ success: false, message: "Unauthorized Request" });
    return;
  }

  try {
    /** 
     * Hash the password before updating if it is provided
     */
    let updateData = { photo, password };
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      updateData.password = hashedPassword;
    }

    const data = await Users.findByIdAndUpdate(
      _id,
      updateData,
      { new: true }
    );

    if (!data) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    } else {
      const { password, refreshToken, lastName, googleId,  isVerified, loginAttempts,
        resetPasswordAttempts, verificationCodeAttempts, verificationResendAttempts, ...sanitizedData } = data.toObject();
      res.status(200).json({ success: true, message: "Profile updated successfully", data: sanitizedData });
      return;
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating profile", error });
    return;
  }
};


export { register, login,
refreshRequest, logout,
verificationCode, resendVerificationCode,
forgotPassword,
resetPassword,
getAllUsers,
deleteUser,
adminProfileEdit,
userProfileEdit };
