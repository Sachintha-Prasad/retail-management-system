import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import morgan from "morgan"
import connectDB from "./config/db.js"
import { errorHandler } from "./middlewares/errorHandler.js"
import logger from "./middlewares/logger.js"

// load env variables
dotenv.config()

// database connection
connectDB()

const app = express()

app.use(express.json())
app.use(morgan("dev"))
app.use(logger)
app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
)

// error handler
app.use(errorHandler)

// app starts here
const port = process.env.PORT || 5000
app.listen(port, () => {
    logger.info(`server running on port ${port}`)
})
