// const Tag = mongoose.model("Tag", { name: String });
import mongoose from "mongoose";
const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Tag = mongoose.model("Tag", tagSchema);
