// middlewares/logger.js
import winston from "winston"

const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf(
            ({ timestamp, level, message }) =>
                `${timestamp} ${level}: ${message}`
        )
    ),
    transports: [new winston.transports.Console()]
})

const logMiddleware = (req, res, next) => {
    logger.info(`${req.method} ${req.originalUrl}`)
    next()
}

export default logMiddleware
export { logger }
