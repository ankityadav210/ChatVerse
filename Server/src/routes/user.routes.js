import {
  getMyProfile,
  loggedInUser,
  logoutUser,
  registerUser,
  searchUser,
} from "../controllers/user.controllers.js";

import { Router } from "express";
import { singleAvatar } from "../middlewares/multer.middlewares.js";
import { verifyJwtUser } from "../middlewares/auth.middlewares.js";

const router = Router();

router.post("/register", singleAvatar, registerUser);
router.post("/login", loggedInUser);
// router.use(verifyJwtUser); // pending ...

router.get("/logout", verifyJwtUser, logoutUser);
router.get("/me", verifyJwtUser, getMyProfile);
router.get("/search", verifyJwtUser, searchUser);

export default router;
