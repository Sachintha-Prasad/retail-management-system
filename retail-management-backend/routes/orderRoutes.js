import express from "express"
import {
    getAllOrders,
    getOrder,
    createOrder,
    updateOrderStatus,
    deleteOrder
} from "../controllers/orderController.js"

const router = express.Router()

router.get("/", getAllOrders)
router.get("/:id", getOrder)
router.post("/", createOrder)
router.put("/:id/status", updateOrderStatus)
router.delete("/:id", deleteOrder)

export default router
