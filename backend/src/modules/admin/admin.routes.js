import { validate } from "../../middleware/validate.middleware.js";
import {
  createStudentSchema,
  createSupervisorSchema,
  assignSupervisorSchema,
} from "../../validators/admin.validator.js";

// Add student
router.post(
  "/student",
  verifyUser,
  requireAuth,
  requireHOD,
  validate(createStudentSchema),
  addStudent
);

// Add supervisor
router.post(
  "/supervisor",
  verifyUser,
  requireAuth,
  requireHOD,
  validate(createSupervisorSchema),
  addSupervisor
);

// Assign supervisor
router.post(
  "/assign",
  verifyUser,
  requireAuth,
  requireHOD,
  validate(assignSupervisorSchema),
  assignSupervisor
);