import { DB_NAME } from "../constants.js";
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}${DB_NAME}`
    );

    console.log(
      ` \n MongoDB connected !!!  DB : ${connectionInstance}  DB HOST : ${connectionInstance.connection.host}`
    );
    console.log("MongoDB connected to our server ");
  } catch (error) {
    console.log("mongoDB connection failed then showing message", error);
    process.exit(1);
  }
};

export default connectDB;
