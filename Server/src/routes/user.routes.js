import {
  loggedInUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controllers.js";

import { Router } from "express";
import { verifyJwtUser } from "../middlewares/auth.middlewares.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loggedInUser);
router.get("/logout", verifyJwtUser, logoutUser);

export default router;
