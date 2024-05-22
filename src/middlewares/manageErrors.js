const manageErrors = (error, _req, res, _next) => {
  res.status(error.httpStatus || 500).send({ error: error.message });
};

export default manageErrors;
