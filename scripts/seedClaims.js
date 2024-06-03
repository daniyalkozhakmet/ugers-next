import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose, { Schema } from "mongoose";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceFilePath = path.join(__dirname, "data.json");
import data from "./data.json" assert { type: "json" };
// console.log(data);
// const jsonArray = JSON.parse(data);
// console.log(data.slice(0, 5));
const seedClaims = async (data) => {
  try {
    await mongoose.connect(
      "mongodb+srv://daniyalkozhakmetov:KLyVxT0wnKo7AOGt@ugers.czqr8yk.mongodb.net/ugers?retryWrites=true&w=majority&appName=ugers",
      {}
    );
    // Remove existing data (optional)

    // Insert new data
    await Claim.insertMany(data);

    console.log("Claim data seeded successfully");
  } catch (err) {
    console.error("Error seeding Res data:", err);
  } finally {
    await mongoose.disconnect();
  }
};
seedClaims(data);
// fs.readFile(sourceFilePath, "utf8", (err, data) => {
//   if (err) {
//     console.error("Error reading the file:", err);
//     return;
//   }

//   try {
//     // Parse the JSON data
//     const jsonArray = JSON.parse(data);
//     console.log(jsonArray);
//     seedClaims(jsonArray.slice(0, 15));
//   } catch (parseErr) {
//     console.error("Error parsing JSON data:", parseErr);
//   }
// });
const claimSchema = new Schema(
  {
    claim_number: {
      type: String,
      unique: true,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    date_of_excavation: {
      type: Date,
      required: false,
    },
    date_of_sending: {
      type: Date,
      required: true,
    },
    direction: {
      type: String,
      required: true,
    },
    date_of_fixing: {
      type: Date,
      required: false,
    },
    date_of_obtaing_fail: {
      type: Date,
      required: false,
    },
    date_of_sending_claim_by_obtaining_fail: {
      type: Date,
      required: false,
    },
    date_of_signing: {
      type: Date,
      required: false,
    },
    date_recovery_ABP: {
      type: Date,
      required: false,
    },
    govern: {
      type: Boolean,
      default: false,
      required: true,
    },
    image1: {
      type: String,
      required: false,
    },
    image2: {
      type: String,
      required: false,
    },
    image3: {
      type: String,
      required: false,
    },
    image4: {
      type: String,
      required: false,
    },
    image5: {
      type: String,
      required: false,
    },
    image6: {
      type: String,
      required: false,
    },
    image7: {
      type: String,
      required: false,
    },
    invent_num: {
      type: String,
      required: true,
    },
    neighborhood: {
      type: String,
      required: true,
    },
    open_square: {
      type: String,
      required: true,
    },
    square_restored_area: {
      type: String,
      required: false,
    },
    street_type: {
      type: String,
      required: true,
    },
    type_of_work: {
      type: String,
      required: true,
    },
    res: {
      type: Schema.Types.ObjectId,
      ref: "Res",
      required: true,
    },
  },
  { timestamps: true }
);
const Claim = mongoose.model("Claim", claimSchema);
