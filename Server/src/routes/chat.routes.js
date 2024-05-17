import {
  addMembers,
  deleteChat,
  generateGroupChat,
  getChatDetails,
  getMyChats,
  getMyGroups,
  leaveGroup,
  removeMember,
  renameGroup,
  sendAttachments,
} from "../controllers/chat.controllers.js";

import { attachmentsMulter } from "../middlewares/multer.middlewares.js";
import express from "express";
import { verifyJwtUser } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.post("/new", verifyJwtUser, generateGroupChat);
router.get("/my", verifyJwtUser, getMyChats);
router.get("/my/groups", verifyJwtUser, getMyGroups);
router.put("/addmembers", verifyJwtUser, addMembers);
router.put("/removemembers", verifyJwtUser, removeMember);
router.delete("/leave/:id", verifyJwtUser, leaveGroup);
router.post("/message", attachmentsMulter, verifyJwtUser, sendAttachments);

// this can help to avoid multiple route dor the same route
router.use(verifyJwtUser); // use the middle ware
router.route("/:id").get(getChatDetails).put(renameGroup).delete(deleteChat);

export default router;
