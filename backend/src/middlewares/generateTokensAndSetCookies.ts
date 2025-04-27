import {
    accessTokenExpiryDate,
    refreshTokenExpiryDate,
  } from "../config/tokenExpiry";
  import jwt from "jsonwebtoken";
  import { Response } from "express";
  import { UsersDocument } from "../models/users";




const generateTokensAndSetCookies = async (user: UsersDocument, res: Response) => {
    
    
    const accessToken = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: accessTokenExpiryDate }
    );
  
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
  
    const refreshToken = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: refreshTokenExpiryDate }
    );
  
    // Save the refresh token in the database
    user.refreshToken = refreshToken;
    await user.save();
  
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
  
    return { accessToken, refreshToken };
  };

  
  export default generateTokensAndSetCookies;