import { Request, Response } from "express";
import Users from "../models/users";
import Course from "../models/Course";
import Purchase from "../models/Purchase";
import Stripe from "stripe";
import CourseProgress from "../models/CourseProgress";
import Notification from "../models/Notification";
import { io, userSocketMap } from "../socketio/socketio";


// get user's data
export const getUserData = async (req:Request, res:Response) => {
    const {_id} = req.body;
    if(!_id) {
        res.status(400).json({ success: false, message: "id required"});
        return;
       };

       try {
        const user = await Users.findById(_id).select(['-password', '-refreshToken', '-lastName', '-googleId', '-isVerified', '-loginAttempts', '-lockLoginUntil', '-resetPasswordAttempts', '-lockResetPasswordUntil',  '-verificationCodeAttempts', '-verificationResendAttempts', '-lockVerificationCodeUntil', '-lockVerificationResendUntil', '-verificationCode', '-verificationCodeExpiresAt']);
        if(!user) {
            res.status(404).json({ success: false, message: "User not found"});
            return;
        }
        res.status(200).json({ success: true, message: "User data fetched successfully", data: user});
        return;
       } catch (error) {
        console.error('getUserData error', error);
        res.status(500).json({ success: false, message: "Error fetching user data", error});
        return;
       }
};


// user's enrolled courses with lecture links
export const userEnrolledCourses = async (req:Request, res:Response) => {
    const {_id} = req.body;
    if(!_id) {
        res.status(400).json({ success: false, message: "id required"});
        return;
       };
       try {
        const userData = await Users.findById(_id).populate('enrolledCourses');
        res.status(200).json({ success: true, message: "User enrolled courses fetched successfully", data: userData?.enrolledCourses});
        return;
       } catch (error) {
        console.error('userEnrolledCourses error', error);
        res.status(500).json({ success: false, message: "Error fetching user enrolled courses", error});
        return;
       }
};


// purchase course
export const purchaseCourse = async (req:Request, res:Response) => {
    const {_id, courseId} = req.body;
    const { origin } = req.headers;
    if(!_id || !courseId) {
        res.status(400).json({ success: false, message: "id and course id required"});
        return;
       };
       try {
        const userData = await Users.findById(_id);
        const courseData = await Course.findById(courseId);
        if(!userData || !courseData) {
            res.status(404).json({ success: false, message: "User or course not found"});
            return;
        };
        const purchaseData = {
            courseId: courseData._id,
            userId: _id,
            amount: (courseData.coursePrice - courseData.discount * courseData.coursePrice / 100 ).toFixed(2),
        };
        const newPurchase = await Purchase.create(purchaseData);
        // stripe gateway initialization
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

        // creating line items for stripe checkout session
        const lineItems = [{
            price_data:{
                currency:"usd",
                product_data:{
                    name:courseData.courseTitle,
                    /*Only include images if courseThumbnail is available, image is array coz sripe api expects it to be array. for js images: [courseData.courseThumbnail] works this done for typescript  */
                    images: courseData.courseThumbnail ? [courseData.courseThumbnail] : []
                },
                unit_amount: Math.floor(newPurchase.amount) * 100,
            },
            quantity:1
        }];
    
        const session = await stripe.checkout.sessions.create({   
            success_url:`${origin}/stripe-success`,
            cancel_url:`${origin}/stripe-cancel`,
            payment_method_types:["card"],
            line_items:lineItems,
            mode:"payment",
            // metadata sent to stripe webhook endpoint should be string. stripe api expects it to be string
            metadata: {
                purchaseId: (newPurchase._id as any).toString(),
            },
        });
    /* Creates a Stripe Checkout Session with metadata like purchaseId.Returns session.url to the frontend.User is redirected to Stripe's hosted payment page.User enters card info and completes payment on Stripe.Stripe internally creates a PaymentIntent (you don’t see this directly, but it’s tied to the session).Once payment is successful, Stripe sends a webhook event to your backend like this:Event type: 'payment_intent.succeeded' n goes to success_url */
        res.status(200).json({ success: true, message: "checkout session created successfully", session_url: session.url});
    console.log("session" ,session);
    return;
        
} catch (error) {
        console.error('purchaseCourse error', error);
        res.status(500).json({ success: false, message: "Error purchasing course", error});
        return;
       };
};


// update user course progress
export const updateUserCourseProgress = async (req: Request, res: Response) => {
    const { userId, courseId, lectureId, notificationId } = req.body;
  
    if (!userId || !courseId || !lectureId) {
       res.status(400).json({ success: false, message: "user id, course id and lecture id required" });
       return;
    }
  
    try {
      const progressData = await CourseProgress.findOne({ userId, courseId });
  
      if (progressData) {
        if (progressData.lectureCompleted.includes(lectureId)) {
          res.status(400).json({ success: false, message: "Lecture already completed" });
          return;
        }
  
        progressData.lectureCompleted.push(lectureId);
        await progressData.save();
  
      } else {
        await CourseProgress.create({ userId, courseId, lectureCompleted: [lectureId] });
      }
  
      const notification = new Notification({
        userId,
        notificationId,
        message: `congratulations! You have completed the ${lectureId} lecture of the ${courseId} course`,
        isRead: false
      });
  
      await notification.save();
  
      // send notification if user is online. realtime push notification
      const socketId = userSocketMap[userId];
      if (socketId) {
        // send notification by user id
        io.to(socketId).emit('notification', {
          notificationId: notification.notificationId,
          message: notification.message,
          isRead: notification.isRead,
        });
      }
  
      res.status(200).json({ success: true, message: "Lecture progress updated successfully" });
      return;
    } catch (error) {
      console.error('updateUserCourseProgress error', error);
      res.status(500).json({ success: false, message: "Error updating user course progress", error });
      return;
    }
  };
  

// get user course progress
export const getUserCourseProgress = async (req:Request, res:Response) => {
    const {userId, courseId } = req.body;
    if(!userId || !courseId) {
        res.status(400).json({ success: false, message: "user id and course id required"});
        return;
       };
       try {
        const progressData = await CourseProgress.findOne({userId, courseId});
        res.status(200).json({ success: true, message: "User course progress fetched successfully", data: progressData});
        return;
       } catch (error) {
        console.error('getUserCourseProgress error', error);
        res.status(500).json({ success: false, message: "Error fetching user course progress", error});
        return;
       };
};


// add user rating to course

export const addUserRating = async (req:Request, res:Response) => {
    const {userId, courseId, rating } = req.body;
     if(!userId || !courseId || !rating || rating < 1 || rating > 5) {
        res.status(400).json({ success: false, message: "invalid details"});
        return;
       };
       try {
        const course = await Course.findById(courseId);
        if(!course) {
            res.status(404).json({ success: false, message: "Course not found"});
            return;
        };
        const user = await Users.findById(userId);
        if(!user || !user.enrolledCourses.includes(courseId)) {
            res.status(404).json({ success: false, message: "User has not purchased this course"});
            return;
        };
        const existingRatingIndex = course.courseRating.findIndex((rating) => rating.userId === userId);
        // user has already rated now re rating
        if(existingRatingIndex > -1) {
        course.courseRating[existingRatingIndex].rating = rating;
        } else {
            // first rating
            course.courseRating.push({ userId, rating });
        };
        await course.save();
        res.status(200).json({ success: true, message: "User rating added successfully"});
       } catch (error) {
        console.error('addUserRating error', error);
        res.status(500).json({ success: false, message: "Error adding user rating", error});
        return;
       };
        };

        