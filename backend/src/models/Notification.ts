import mongoose, { Schema, Model, Document } from "mongoose";



export interface INotification extends Document {
    userId: string;
    notificationId: string;
    message: string;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}


const notificationSchema = new Schema<INotification>({
      userId: { type: String, required: true },
      notificationId: { type: String, required: true },
      message: { type: String, required: true },
      isRead: { type: Boolean, default: false },
},
{ timestamps: true }
);


const Notification: Model<INotification> = mongoose.model<INotification>("Notification", notificationSchema);
export default Notification;