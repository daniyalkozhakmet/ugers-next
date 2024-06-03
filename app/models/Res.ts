import mongoose from "mongoose";
export interface IRes extends Document {
  name: string;
}
const { Schema } = mongoose;
const resSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Res || mongoose.model<IRes>("Res", resSchema);
