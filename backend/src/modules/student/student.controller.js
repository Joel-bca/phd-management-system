import * as studentService from "./student.service.js";

export const getProfile = async (req, res) => {
  try {
    const data = await studentService.getStudentFullProfile(req.user.id);
    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { personal_email, mobile } = req.body;
    const data = await studentService.updateStudentContact(req.user.id, {
      personal_email,
      mobile,
    });
    res.json({ success: true, message: "Profile updated successfully", data });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// ---------------------------------------------------------------------
// RAC Meeting Minutes / Progress Review
// ---------------------------------------------------------------------

export const getMeetingMinutes = async (req, res) => {
  try {
    const data = await studentService.getMeetingForMinutes(
      req.params.meetingId,
      req.user.id,
    );
    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const saveMinutesDraft = async (req, res) => {
  try {
    const data = await studentService.saveMeetingMinutesDraft(
      req.params.meetingId,
      req.user.id,
      req.body,
    );
    res.json({ success: true, message: "Draft saved", data });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const submitMinutes = async (req, res) => {
  try {
    const data = await studentService.submitMeetingMinutes(
      req.params.meetingId,
      req.user.id,
    );
    res.json({ success: true, message: "Minutes submitted", data });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};