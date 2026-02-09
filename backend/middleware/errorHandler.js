import { AppError } from "../utils/errors.js";

export const errorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    console.error("Error occurred:", {
      name: err.name,
      message: err.message,
      statusCode: err.statusCode,
      path: req.path,
      method: req.method,
    });
  }

  // Default error values
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";
  let errors = err.errors || undefined;

  if (err.isOperational) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
    });
  }

  // Handle Prisma errors
  if (err.code && err.code.startsWith("P")) {
    statusCode = 400;
    
    switch (err.code) {
      case "P2002":
        message = "A record with this information already exists";
        statusCode = 409;
        break;
      case "P2025":
        message = "Record not found";
        statusCode = 404;
        break;
      case "P2003":
        message = "Invalid reference or relation";
        break;
      case "P2014":
        message = "Invalid ID provided";
        break;
      case "P2021":
        message = "Table does not exist";
        statusCode = 500;
        break;
      default:
        message = "Database operation failed";
        statusCode = 500;
    }
    
    return res.status(statusCode).json({
      success: false,
      message,
    });
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token expired",
    });
  }

  if (err.name === "ValidationError" && err.errors) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.errors,
    });
  }

  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON format",
    });
  }

  const isProduction = process.env.NODE_ENV === "production";
  
  return res.status(statusCode).json({
    success: false,
    message: isProduction ? "Internal server error" : message,
    ...(isProduction ? {} : { stack: err.stack }),
  });
};

export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
  });
};