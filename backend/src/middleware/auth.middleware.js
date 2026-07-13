import supabaseAdmin from "../config/supabaseAdmin.js";

// AUTH CHECK
export const verifyUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ success: false, error: "Invalid token" });
    }

    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("role, name, is_hod, is_coordinator")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return res.status(401).json({ success: false, error: "Profile not found" });
    }

    req.user = { 
      id: user.id, 
      email: user.email, 
      name: profile.name,
      role: profile.role,
      is_hod: profile.is_hod || profile.role === "hod",
      is_coordinator: profile.is_coordinator || profile.role === "coordinator"
    };
    req.token = token;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    return res.status(401).json({ success: false, error: "Token verification failed" });
  }

};

export const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized",
    });
  }
  next();
};

// SUPERVISOR (HOD override)
export const requireSupervisor = (req, res, next) => {
  const user = req.user;

  if (user.role === "supervisor" || user.is_hod) {
    return next();
  }

  return res.status(403).json({
    success: false,
    error: "Forbidden",
  });
};

// HOD ONLY
export const requireHOD = (req, res, next) => {
  if (req.user?.is_hod) return next();

  return res.status(403).json({
    success: false,
    error: "HOD only",
  });
};

// 🚨 BLOCK WRITES FOR COORDINATOR
export const blockWriteIfCoordinator = (req, res, next) => {
  const user = req.user;

  // Only block if it's a WRITE request
  if (
    user?.is_coordinator &&
    ["POST", "PUT", "PATCH", "DELETE"].includes(req.method)
  ) {
    return res.status(403).json({
      success: false,
      error: "Coordinator is read-only",
    });
  }

  next();
};