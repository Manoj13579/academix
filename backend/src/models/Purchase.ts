import mongoose, { Schema, Model, Document } from "mongoose";



export interface IPurchase extends Document {
    courseId: mongoose.Schema.Types.ObjectId;
    userId: mongoose.Schema.Types.ObjectId;
    amount: number;
    status: "pending" | "completed" | "failed";
    createdAt: Date;
    updatedAt: Date;
}


const purchaseSchema = new Schema<IPurchase>({
      courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
      amount: { type: Number, required: true },
      status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
},
{ timestamps: true }
);


const Purchase: Model<IPurchase> = mongoose.model<IPurchase>("Purchase", purchaseSchema);
export default Purchase;