import express from "express";
import { verifyUser, requireAuth } from "../../middleware/auth.middleware.js";
import {
  getProfile,
  updateProfile,
  getMeetingMinutes,
  saveMinutesDraft,
  submitMinutes,
} from "./student.controller.js";

const router = express.Router();

router.get("/profile", verifyUser, requireAuth, getProfile);
router.put("/profile", verifyUser, requireAuth, updateProfile);

// RAC Meeting Minutes / Progress Review
router.get(
  "/meetings/:meetingId/minutes",
  verifyUser,
  requireAuth,
  getMeetingMinutes,
);
router.put(
  "/meetings/:meetingId/minutes",
  verifyUser,
  requireAuth,
  saveMinutesDraft,
);
router.post(
  "/meetings/:meetingId/minutes/submit",
  verifyUser,
  requireAuth,
  submitMinutes,
);

export default router;