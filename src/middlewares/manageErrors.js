const manageErrors = (error, _req, res, _next) => {
  console.log('Estoy en manageError, bieeeen');
  res.status(error.httpStatus || 500).send({ error: error.message });
};

export default manageErrors;
