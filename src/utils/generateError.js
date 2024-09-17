const generateError = (msg, httpStatus) => {
    const error = typeof msg === 'string' ? new Error(msg) : msg
    error.httpStatus = httpStatus || 500
    throw error
}

export default generateError
