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
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
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
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
  
    return { accessToken, refreshToken };
  };

  
  export default generateTokensAndSetCookies;