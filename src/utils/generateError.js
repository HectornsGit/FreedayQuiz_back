const generateError = (msg, httpStatus) => {
  const error = new Error(msg);
  error.httpStatus = httpStatus;

  throw error;
};

export default generateError;
