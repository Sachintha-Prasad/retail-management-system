import express from "express"
import {
    addToCart,
    getCart,
    updateCartItem,
    removeFromCart,
    clearCart
} from "../controllers/cartController.js"

const router = express.Router()

router.post("/add", addToCart)
router.get("/:customerId", getCart)
router.put("/update", updateCartItem)
router.delete("/remove", removeFromCart)
router.delete("/clear", clearCart)

export default router
