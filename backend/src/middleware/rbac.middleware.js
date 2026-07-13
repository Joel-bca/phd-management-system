// Role check (student / supervisor)
export const requireRole = (roles = []) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    if (!roles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        error: "Forbidden: Insufficient role",
      });
    }

    next();
  };
};

// HOD only
export const requireHOD = () => {
  return (req, res, next) => {
    const user = req.user;

    if (!user?.is_hod) {
      return res.status(403).json({
        success: false,
        error: "Forbidden: HOD only",
      });
    }

    next();
  };
};

// Coordinator (read-only type access)
export const requireCoordinator = () => {
  return (req, res, next) => {
    const user = req.user;

    if (!user?.is_coordinator) {
      return res.status(403).json({
        success: false,
        error: "Forbidden: Coordinator only",
      });
    }

    next();
  };
};