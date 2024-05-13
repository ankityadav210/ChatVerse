import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userName: {
      userName: String,
      unique: true,
      required: true,
      lowercase: true,
      index: true,
    },
    bio: {
      type: String,
      required: true,
    },
    avatar: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
