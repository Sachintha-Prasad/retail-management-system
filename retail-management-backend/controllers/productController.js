import { Product } from "../models/Product.js"

// Get all products
export const getAllProducts = async (req, res, next) => {
    try {
        const products = await Product.find()
        res.status(200).json(products)
    } catch (err) {
        next(err)
    }
}

// Get single product by ID
export const getProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id)
        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }
        res.status(200).json(product)
    } catch (err) {
        next(err)
    }
}

// Add a new product
export const addProduct = async (req, res, next) => {
    try {
        const { name, description, price, image, category, stock, featured } =
            req.body
        const product = new Product({
            name,
            description,
            price,
            image,
            category,
            stock,
            featured,
            createdAt: new Date()
        })
        await product.save()
        res.status(201).json(product)
    } catch (err) {
        next(err)
    }
}

// Update product by ID
export const updateProduct = async (req, res, next) => {
    try {
        const { name, description, price, image, category, stock, featured } =
            req.body
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { name, description, price, image, category, stock, featured },
            { new: true }
        )
        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }
        res.status(200).json(product)
    } catch (err) {
        next(err)
    }
}

// Update product stock by ID
export const updateStock = async (req, res, next) => {
    try {
        const { quantity } = req.body
        const product = await Product.findById(req.params.id)
        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }

        // Update the product's stock
        product.stock = quantity
        await product.save()

        res.status(200).json(product)
    } catch (err) {
        next(err)
    }
}

// Delete product by ID
export const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id)
        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }
        res.status(200).json({ message: "Product deleted" })
    } catch (err) {
        next(err)
    }
}
