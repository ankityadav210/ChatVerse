import { loggedInUser, registerUser } from "../controllers/user.controllers.js";

import { Router } from "express";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loggedInUser);

export default router;
