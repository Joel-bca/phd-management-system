import { login } from "./auth.service.js";

export const loginController = async (req, res) => {
  const { email, password } = req.body;

  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || null;

  try {
    const result = await login(email, password, ip);
    res.json(result);
  } catch (err) {
    const message = err?.message || "Login failed";
    console.error("Login Error:", message);

    if (message.includes("Supabase") || message.includes("environment variables")) {
      return res.status(500).json({ error: message });
    }

    return res.status(401).json({ error: message });
  }
};