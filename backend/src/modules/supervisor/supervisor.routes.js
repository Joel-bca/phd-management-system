import express from "express";
import { verifyUser, requireAuth } from "../../middleware/auth.middleware.js";
import { getMyStudents } from "./supervisor.controller.js";

const router = express.Router();

router.get("/my-students", verifyUser, requireAuth, getMyStudents);

export default router;
