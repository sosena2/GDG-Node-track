// Custom Error Handling Middleware

export const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Log error to console

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    message: err.message,
    // In development, you can include stack trace
    stack: process.env.NODE_ENV === "production" ? null : err.stack
  });
};
