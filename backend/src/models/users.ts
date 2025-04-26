import mongoose, { Schema, Model, Document } from "mongoose";

// Extend mongoose.Document while keeping optional properties unchanged
export interface UsersDocument extends Document {
  firstName: string;
  lastName?: string;
  googleId?: string;
  email: string;
  password?: string; // Optional for Google users
  refreshToken?: string;
  role?: "user" | "admin";
  authProvider: "jwt" | "google";
  isVerified: boolean;
  photo?: string;
  enrolledCourses: mongoose.Types.ObjectId[];
  verificationCode?: string;
  verificationCodeExpiresAt?: Date;
  verificationCodeAttempts: number;
  lockVerificationCodeUntil?: Date;
  verificationResendAttempts: number;
  lockVerificationResendUntil?: Date;
  resetPasswordAttempts: number;
  lockResetPasswordUntil?: Date;
  loginAttempts: number;
  lockLoginUntil?: Date;
}

const usersSchema = new Schema<UsersDocument>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String },
    googleId: { type: String },
    email: { type: String, required: true, lowercase: true, trim: true },
    password: {
      type: String,
      required: function (this: UsersDocument) {
        return !this.googleId;
      },
    },
    refreshToken: { type: String },
    role: { type: String, required: true, enum: ["user", "admin"], default: "user" },
    authProvider: { type: String, enum: ["jwt", "google"], required: true },
    isVerified: { type: Boolean, default: false },
    photo: { type: String },
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    verificationCode: String,
    verificationCodeExpiresAt: Date,
    verificationCodeAttempts: { type: Number, default: 0 },
    lockVerificationCodeUntil: Date,
    verificationResendAttempts: { type: Number, default: 0 },
    lockVerificationResendUntil: Date,
    resetPasswordAttempts: { type: Number, default: 0 },
    lockResetPasswordUntil: Date,
    loginAttempts: { type: Number, default: 0 },
    lockLoginUntil: Date,
  },
  { timestamps: true }
);

// Ensure unique email per authProvider
usersSchema.index({ email: 1, authProvider: 1 }, { unique: true });

const Users: Model<UsersDocument> = mongoose.model<UsersDocument>("Users", usersSchema);
export default Users;