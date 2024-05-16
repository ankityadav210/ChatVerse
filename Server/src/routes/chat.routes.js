import {
  generateGroupChat,
  getMyChats,
  getMyGroups,
} from "../controllers/chat.controllers.js";

import express from "express";
import { verifyJwtUser } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.post("/new", verifyJwtUser, generateGroupChat);
router.get("/my", verifyJwtUser, getMyChats);
router.get("/my/groups", verifyJwtUser, getMyGroups);

export default router;
