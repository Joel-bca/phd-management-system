import * as supervisorService from "./supervisor.service.js";

export const getMyStudents = async (req, res) => {
  try {
    const data = await supervisorService.getMyStudents(req.token, req.user.id);
    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
