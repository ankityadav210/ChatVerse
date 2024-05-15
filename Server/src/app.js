import chatRoute from "./routes/chat.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import userRoute from "./routes/user.routes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    Credential: true,
  })
);

app.use(express.json({ limit: "16kb" }));

app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

app.use(cookieParser());

// import routes

// user route

app.use("/api/v1/users", userRoute);

// chat route
app.use("/api/v1/chats", chatRoute);

export { app };
