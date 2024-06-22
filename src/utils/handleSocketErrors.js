const handleSocketErrors = (error, socket) => {
  console.error(error.message);
  const httpStatus = error.httpStatus || 500;
  socket.emit('error', { message: error.message, status: httpStatus });
};
export default handleSocketErrors;
