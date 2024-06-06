// create a function to emit a event for the socket io

import { userSocketIDs } from "../app.js";

// cors option

const corsOption = {
  origin: [
    "http://localhost:5173",
    "http://localhost:4173",
    process.env.CLIENT_URL,
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

// socket

const getSockets = (users = []) => {
  const sockets = users.map((user) => {
    userSocketIDs.get(user._id.toString());
  });
  return sockets;
};

const emitEvent = (req, event, users, data) => {
  const io = req.app.get("io");
  const usersSocket = getSockets(users);
  io.to(usersSocket).emit(event, data);
};
export { emitEvent, corsOption };
