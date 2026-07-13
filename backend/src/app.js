import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import meetingRoutes from "./modules/meeting/meeting.routes.js";
import hodRoutes from "./modules/hod/hod.routes.js";
import { rateLimit } from "express-rate-limit";
import studentRoutes from "./modules/student/student.routes.js";
import supervisorRoutes from "./modules/supervisor/supervisor.routes.js";
import systemRoutes from "./modules/system/system.routes.js";

const app = express();

// 🛡️ Security: Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(cors());
app.use(express.json());
app.use(limiter);

app.use("/api/meetings", meetingRoutes);
app.use("/api/hod", hodRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/supervisor", supervisorRoutes);
app.use("/api/system", systemRoutes);
app.get("/api/ping", (req, res) => res.json({ status: "online", node: "nexus_diagnostics" }));

app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

export default app;
