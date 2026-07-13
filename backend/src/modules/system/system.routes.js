import express from "express";
import { getSystemManifest } from "./system.controller.js";
import { verifyUser } from "../../middleware/auth.middleware.js";

const router = express.Router();

// This endpoint is accessible to any authenticated user (Student, Supervisor, HOD)
router.get("/manifest", verifyUser, getSystemManifest);

export default router;
