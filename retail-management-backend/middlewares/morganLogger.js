import morgan from "morgan"
import logger from "../utils/winstonLogger.js"

const morganLogger = morgan("tiny", {
    stream: {
        write: (message) => logger.http(message.trim())
    }
})

export default morganLogger
