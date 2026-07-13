import { login } from "./auth.service.js";

export const loginController = async (req, res) => {
  const { email, password } = req.body;

  // extract IP (basic version)
  const ip =
    req.headers["x-forwarded-for"] || req.socket.remoteAddress || null;

  try {
    const result = await login(email, password, ip);
    res.json(result);
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(401).json({ error: err.message });
  }
};