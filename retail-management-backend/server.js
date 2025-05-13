import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import logger from "./utils/logger.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
connectDB();

// middlewares
app.use(express.json({ limit: '50mb' }));
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH","DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

// morgan logger
const morganFormat = ":method :status :url :response-time ms";
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          status: message.split(" ")[1],
          url: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };

        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

// routes
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/users", userRoutes);

// error handler
app.use(globalErrorHandler);

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
