import {
  createMeetings,
  updateMeeting,
  getMeetings,
  deleteMeeting,
} from "./meeting.service.js";

import {
  createMeetingSchema,
  updateMeetingSchema,
} from "./meeting.validation.js";

export const createMeetingController = async (req, res) => {
  try {
    const parsed = createMeetingSchema.parse(req.body);

    const data = await createMeetings(
      req.token,
      req.user.id,
      parsed
    );

    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const updateMeetingController = async (req, res) => {
  try {
    const parsed = updateMeetingSchema.parse(req.body);

    const data = await updateMeeting(
      req.token,
      req.params.id,
      parsed
    );

    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const deleteMeetingController = async (req, res) => {
  try {
    const data = await deleteMeeting(
      req.token,
      req.params.id
    );

    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const getMeetingsController = async (req, res) => {
  try {
    const showDeleted = req.query.all === "true";
    const data = await getMeetings(req.token, req.user, showDeleted);

    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};