import { corsOption, getSockets } from "./utils/features.js";

import { Message } from "./models/messages.models .js";
import { NEW_MESSAGE } from "./constants.js";
import { Server } from "socket.io";
import chatRoute from "./routes/chat.routes.js";
import { v2 as cloudinary } from "cloudinary";
import { connectDB } from "./db/dbConnection.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createServer } from "http";
import dotenv from "dotenv";
import { errorMiddleware } from "./middlewares/error.middlewares.js";
import express from "express";
import userRoute from "./routes/user.routes.js";
import { v4 as uuid } from "uuid";

// config the dotenv file

dotenv.config({
  path: "./.env",
});

const port = process.env.PORT || 3000;
const envMode = process.env.NODE_ENV.trim() || "PRODUCTION";
const mongoURI = process.env.MONGODB_URI;
const userSocketIDs = new Map();

// called the mongo db connection function
connectDB(mongoURI);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: corsOption,
});

app.set("io", io);

// set up and use the error middle ware ti show proper representation of the error
app.use(express.json({ limit: "16kb" }));

app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cors(corsOption));

app.use(cookieParser());

// import routes

// user route

app.use("/api/v1/users", userRoute);

// chat route
app.use("/api/v1/chats", chatRoute);

app.get("/", (req, res) => {
  res.send("hello Users");
});

// event for the socket io

io.on("connection", (socket) => {
  const user = {
    _id: "hello",
    name: "mogo",
  };

  userSocketIDs.set(user._id.toString(), socket.id);
  // currently active users
  console.log(userSocketIDs);
  console.log("a user is connected : ", socket.id);

  socket.on(NEW_MESSAGE, async ({ chatId, members, message }) => {
    const messageForRealTime = {
      _id: uuid(),
      content: message,
      sender: {
        _id: user._id,
        name: user.name,
      },
      chat: chatId,
      createdAt: new Date().toISOString(),
    };

    // for db
    const messageForDB = {
      content: message,
      sender: user._id,
      chat: chatId,
    };

    // members
    const membersSocket = getSockets(members);
    io.to(membersSocket).emit(NEW_MESSAGE, {
      message: messageForRealTime,
      chat: chatId,
    });
    io.to(membersSocket).emit("NEW_MESSAGE_ALERT", { chatId });

    //save  message  in the db

    try {
      await Message.create(messageForDB);
    } catch (error) {
      console.log(error);
    }
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
    userSocketIDs.delete(user._id.toString());
  });
});

app.use(errorMiddleware);

server.listen(port, () => {
  console.log(`Server is running on port ${port} in ${envMode} Mode`);
});

export { envMode, userSocketIDs };
