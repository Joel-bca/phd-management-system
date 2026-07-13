import express from "express";
import {
  createMeetingController,
  updateMeetingController,
  getMeetingsController,
  deleteMeetingController,
} from "./meeting.controller.js";

import { verifyUser } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", verifyUser, createMeetingController);
router.put("/:id", verifyUser, updateMeetingController);
router.get("/", verifyUser, getMeetingsController);
router.delete("/:id", verifyUser, deleteMeetingController);

export default router;