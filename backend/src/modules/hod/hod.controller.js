import {
  createSupervisor,
  createStudent,
  assignSupervisor,
  fetchUsers,
  bulkCreateStudents,
  bulkCreateSupervisors,
  createBatch,
  fetchBatches,
  fetchMeetingHistory,
} from "./hod.service.js";

import {
  createSupervisorSchema,
  createStudentSchema,
  assignSupervisorSchema,
  bulkStudentSchema,
  bulkSupervisorSchema,
  createBatchSchema,
} from "./hod.validation.js";
import supabaseAdmin from "../../config/supabaseAdmin.js";

export const getUsers = async (req, res) => {
  const { role } = req.query;
  try {
    // supabaseAdmin ignores RLS policies, which stops the infinite loop
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("role", role);

    if (error) throw error;
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const createSupervisorController = async (req, res) => {
  try {
    const parsed = createSupervisorSchema.parse(req.body);
    const data = await createSupervisor(parsed);

    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const createStudentController = async (req, res) => {
  try {
    const parsed = createStudentSchema.parse(req.body);
    const data = await createStudent(parsed);

    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const assignSupervisorController = async (req, res) => {
  try {
    const parsed = assignSupervisorSchema.parse(req.body);

    const data = await assignSupervisor(req.token, parsed);

    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const fetchUsersController = async (req, res) => {
  try {
    const role = req.query.role;
    const data = await fetchUsers(req.token, role);

    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const bulkStudentsController = async (req, res) => {
  try {
    const parsed = bulkStudentSchema.parse(req.body);

    const data = await bulkCreateStudents(parsed);

    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const bulkSupervisorsController = async (req, res) => {
  try {
    const parsed = bulkSupervisorSchema.parse(req.body);

    const data = await bulkCreateSupervisors(parsed);

    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const createBatchController = async (req, res) => {
  try {
    const parsed = createBatchSchema.parse(req.body);
    const data = await createBatch(parsed);

    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const fetchBatchesController = async (req, res) => {
  try {
    const data = await fetchBatches();
    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getSystemManifest = async (req, res) => {
  try {
    // This bypasses all RLS "recursion" bugs because it uses the Service Key
    const { data, error } = await supabaseAdmin
      .from("vision_manifest")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error("SUPABASE ERROR:", error.message);
      return res.status(400).json({ success: false, message: error.message });
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("CRITICAL CONTROLLER ERROR:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const getFailedLogins = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("failed_logins")
      .select("*")
      .order("last_attempt_at", { ascending: false })
      .limit(10);

    if (error) throw error;

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMeetingHistoryController = async (req, res) => {
  try {
    const data = await fetchMeetingHistory();

    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
