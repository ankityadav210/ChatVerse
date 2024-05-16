import {
  generateGroupChat,
  getMyChats,
} from "../controllers/chat.controllers.js";

import express from "express";
import { verifyJwtUser } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.post("/new", verifyJwtUser, generateGroupChat);
router.get("/my", verifyJwtUser, getMyChats);

export default router;
