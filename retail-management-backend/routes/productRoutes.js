import express from "express"
import {
    getAllProducts,
    getProduct,
    addProduct,
    updateProduct,
    deleteProduct,
    updateStock
} from "../controllers/productController.js"

const router = express.Router()

router.get("/", getAllProducts)
router.get("/:id", getProduct)
router.post("/", addProduct)
router.put("/:id", updateProduct)
router.delete("/:id", deleteProduct)
router.patch("/:id/stock", updateStock)

export default router
