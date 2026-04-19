export const errorHandler = (err, req, res, next) => {
  console.error("🔥 ERROR:", err.message);

  // 🔥 Default values
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // 🧼 Joi validation error
  if (err.name === "ValidationError" || err.isJoi) {
    statusCode = 400;
    message = err.details?.[0]?.message || "Validation error";
  }

  // 🔐 JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};