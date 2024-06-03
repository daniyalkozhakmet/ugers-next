// src/scripts/seedRes.ts
import mongoose, { Schema, Types } from "mongoose";

import bcrypt from "bcryptjs";
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
      //   enum: Object.values(UserRole),
      //   default: UserRole.USER,
      required: true,
    },
    res: {
      type: Schema.Types.ObjectId,
      ref: "Res",
      // required: function (this) {
      //   return this.role !== UserRole.ADMIN;
      // },
    }, // Required if not admin
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
// Array of initial Res data
const userData = [
  {
    email: "admin@azhk.kz",
    password: await bcrypt.hash("password", 10),
    role: "admin",
  },
];

const seedRes = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://daniyalkozhakmetov:KLyVxT0wnKo7AOGt@ugers.czqr8yk.mongodb.net/ugers?retryWrites=true&w=majority&appName=ugers",
      {}
    );
    // Remove existing data (optional)
    await User.deleteMany({});

    // Insert new data
    await User.insertMany(userData);

    console.log("User data seeded successfully");
  } catch (err) {
    console.error("Error seeding Res data:", err);
  } finally {
    await mongoose.disconnect();
  }
};

seedRes();
