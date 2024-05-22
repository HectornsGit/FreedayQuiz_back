const notFoundRoute = (_req, res) => {
  res.status(404).send({ error: 'Not found' });
};

export default notFoundRoute;
