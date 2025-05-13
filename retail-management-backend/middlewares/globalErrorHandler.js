import logger from "../utils/logger.js"

function globalErrorHandler(error, req, res, next) {
    error.statusCode = error.statusCode || 500
    error.status = error.status || "error"
    const message = error.message || "Internal Server Error"

    if (error.statusCode >= 500) {
        logger.error({
            message,
            stack: error.stack
        })
    } else {
        logger.warn({
            message
        })
    }

    res.status(error.statusCode).json({
        status: error.status,
        message
    })
}

export default globalErrorHandler
