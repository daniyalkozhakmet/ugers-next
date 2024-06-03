// src/scripts/seedRes.ts
import mongoose, { Schema } from "mongoose";

const ResSchema = new Schema({
  name: { type: String, required: true },
});

const Res = mongoose.model("Res", ResSchema);
// Array of initial Res data
const resData = [
  { name: "1" },
  { name: "2" },
  { name: "3" },
  { name: "4" },
  { name: "5" },
  { name: "6" },
  { name: "7" },
];

const seedRes = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://daniyalkozhakmetov:KLyVxT0wnKo7AOGt@ugers.czqr8yk.mongodb.net/ugers?retryWrites=true&w=majority&appName=ugers",
      {}
    );
    // Remove existing data (optional)
    await Res.deleteMany({});

    // Insert new data
    await Res.insertMany(resData);

    console.log("Res data seeded successfully");
  } catch (err) {
    console.error("Error seeding Res data:", err);
  } finally {
    await mongoose.disconnect();
  }
};

seedRes();
