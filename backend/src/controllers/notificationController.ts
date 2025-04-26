import { Request, Response } from "express";
import Notification from "../models/Notification";

// Mark a notification as read
export const markNotificationAsRead = async (req: Request, res: Response) => {
    const { notificationId } = req.body;
    if (!notificationId) {
      res.status(400).json({ success: false, message: "Notification ID is required" });
      return;
    }
    try {
      const updated = await Notification.findOneAndUpdate(
        { notificationId },
        { isRead: true },
        { new: true }
      );
      
      if (!updated) {
        res.status(404).json({ success: false, message: "Notification not found" });
        return;
      }
      res.status(200).json({ success: true, message: "Notification marked as read", data: updated });
      return
    } catch (error) {
        console.error('markNotificationAsRead error', error);
      res.status(500).json({ success: false, message: "Failed to mark as read", error });
      return;
    }
  };
  
  // Get all notifications for a user
  export const getAllNotifications = async (req: Request, res: Response) => {
    const { _id } = req.params;
    console.log(_id);
    
    if (!_id) {
      res.status(400).json({ success: false, message: "User ID is required" });
      return;
    }
    try {
        const notifications = await Notification.find({ userId: _id }).sort({ createdAt: -1 });
        if (!notifications) {
          res.status(404).json({ success: false, message: "Notification not found" });
          return;
        }
      res.status(200).json({ success: true, message: "Notifications fetched successfully" , data:notifications });
      return;
    } catch (error) {
        console.error('getAllNotifications error', error);
      res.status(500).json({ success: false, message: "Failed to fetch notifications", error });
      return;
    }
  };
  
  // Delete a notification
  export const deleteNotification = async (req: Request, res: Response) => {
    const { notificationId } = req.params;
    if (!notificationId) {
      res.status(400).json({ success: false, message: "Notification ID is required" });
      return;
    }
    try {
      const deleted = await Notification.findOneAndDelete({ notificationId });
      if (!deleted) {
        res.status(404).json({ success: false, message: "Notification not found" });
        return;
      }
      res.status(200).json({ success: true, message: "Notification deleted" });
      return;
    } catch (error) {
        console.error('deleteNotification error', error);
      res.status(500).json({ success: false, message: "Failed to delete notification", error });
      return;
    }
  };