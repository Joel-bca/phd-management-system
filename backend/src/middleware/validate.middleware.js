export const validate = (schema) => {
  return (req, res, next) => {
    try {
      const result = schema.parse(req.body);
      req.validatedData = result;
      next();
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err.errors.map((e) => e.message),
      });
    }
  };
};