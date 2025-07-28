const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const data = err.data;

  res.status(status).json({
    success: false,
    message,
    data,
  });
};

export default errorHandler;
