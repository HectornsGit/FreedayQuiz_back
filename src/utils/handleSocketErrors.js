const handleSocketErrors = (error, socket) => {
    console.error(error)
    const httpStatus = error.httpStatus || 500
    socket.emit('error', { message: error.message, status: httpStatus })
}
export default handleSocketErrors
