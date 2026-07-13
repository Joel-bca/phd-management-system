import {
  createStudentService,
  createSupervisorService,
  assignSupervisorService,
  fetchUsersService,
  bulkStudentService,
} from "./admin.service.js";

export const addStudent = async (req, res) => {
  try {
    const data = await createStudentService(req.validatedData);

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

export const addSupervisor = async (req, res) => {
  try {
    const data = await createSupervisorService(req.validatedData);

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

export const assignSupervisor = async (req, res) => {
  try {
    const data = await assignSupervisorService(req.validatedData);

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const data = await fetchUsersService(req.query);
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const bulkUploadStudents = async (req, res) => {
  try {
    const data = await bulkStudentService(req.validatedData);
    res.json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};