import mongoose, { Types, Document } from "mongoose";
import { IRes } from "./Res";
import Res from "./Res";
const { Schema } = mongoose;

interface IUser extends Document {
  email: string;
  password: string;
  role: UserRole;
  res?: Types.ObjectId | IRes; // Optional reference to the Res schema
}

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
  VIEWER = "viewer",
  SUPER = "super",
}
delete mongoose.models.User;
const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
      required: true,
    },
    res: {
      type: Schema.Types.ObjectId,
      ref: "Res",
      required: function (this: IUser) {
        return this.role !== UserRole.ADMIN && this.role !== UserRole.VIEWER;
      },
    }, // Required if not admin or viewer
  },
  { timestamps: true }
);

export default mongoose.models.User ||
  mongoose.model<IUser>("User", userSchema);
