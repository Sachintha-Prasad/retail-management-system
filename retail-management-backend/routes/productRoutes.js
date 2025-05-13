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
router.post("/", authorizeRoles("admin"), addProduct)
router.put("/:id", authorizeRoles("admin"), updateProduct)
router.delete("/:id", authorizeRoles("admin"), deleteProduct)
router.patch("/:id/stock", authorizeRoles("admin"), updateStock)

export default router
