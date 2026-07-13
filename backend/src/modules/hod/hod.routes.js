import express from "express";
import { verifyUser } from "../../middleware/auth.middleware.js";

import {
  createSupervisorController,
  createStudentController,
  assignSupervisorController,
  fetchUsersController,
  bulkStudentsController,
  bulkSupervisorsController,
  createBatchController,
  fetchBatchesController,
  getSystemManifest,
  getFailedLogins,
  getUsers,
  getMeetingHistoryController,
} from "./hod.controller.js";

const router = express.Router();

// 🔥 IMPORTANT: only HOD access
const onlyHOD = (req, res, next) => {
  if (!req.user.is_hod) {
    return res.status(403).json({ error: "HOD access only" });
  }
  next();
};

router.post("/supervisor", verifyUser, onlyHOD, createSupervisorController);
router.post("/student", verifyUser, onlyHOD, createStudentController);
router.post("/assign", verifyUser, onlyHOD, assignSupervisorController);
router.post("/bulk/students", verifyUser, onlyHOD, bulkStudentsController);
router.post(
  "/bulk/supervisors",
  verifyUser,
  onlyHOD,
  bulkSupervisorsController,
);

router.post("/batch", verifyUser, onlyHOD, createBatchController);
router.get("/batches", verifyUser, onlyHOD, fetchBatchesController);

router.get("/users", verifyUser, onlyHOD, fetchUsersController);

router.get("/manifest", verifyUser, onlyHOD, getSystemManifest);
router.get("/failed-logins", verifyUser, onlyHOD, getFailedLogins);
router.get("/meetings/history", verifyUser, onlyHOD, getMeetingHistoryController);

export default router;
