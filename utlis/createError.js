const createError = (statusCode, message, data = null) => {
  const error = new Error(message);
  error.statusCode = statusCode;

  if (data) {
    error.data = data;
  }
  return error;
};

export default createError;
