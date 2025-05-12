import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./config/db.js"
import morganLogger from "./middlewares/morganLogger.js"
import globalErrorHandler from "./middlewares/globalErrorHandler.js"
import logger from "./utils/winstonLogger.js"
import productRoutes from "./routes/productRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"

dotenv.config()

const app = express()
connectDB()

// middlewares
app.use(express.json())
app.use(cors()) // ✅ fix applied
app.use(morganLogger)

// routes
app.use("/api/products", productRoutes)
app.use("/api/orders", orderRoutes)

app.get("/", (req, res) => {
    res.send("API is working ✅")
})

// error handler
app.use(globalErrorHandler)

// start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`)
})
