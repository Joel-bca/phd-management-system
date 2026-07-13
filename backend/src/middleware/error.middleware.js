export const errorHandler = (err, req, res, next) => {
  console.error("ERROR:", err.message);

  return res.status(500).json({
    success: false,
    error: "Internal Server Error",
  });
};