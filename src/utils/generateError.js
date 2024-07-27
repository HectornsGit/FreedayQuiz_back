const generateError = (msg, httpStatus) => {
    const error = new Error(msg)
    error.httpStatus = httpStatus || 500
    throw error
}

export default generateError
