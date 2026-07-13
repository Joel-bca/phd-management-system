import express from "express";
import { verifyUser, requireAuth } from "../../middleware/auth.middleware.js";
import { getProfile, updateProfile } from "./student.controller.js";

const router = express.Router();

router.get("/profile", verifyUser, requireAuth, getProfile);
router.put("/profile", verifyUser, requireAuth, updateProfile);

export default router;
