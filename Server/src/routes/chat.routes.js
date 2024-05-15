import { chat } from "../controllers/chat.controllers.js";
import express from "express";

const router = express.Router();

router.get("/chat", chat);
export default router;
