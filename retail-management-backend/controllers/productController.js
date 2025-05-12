import { Product } from "../models/product.js"

// get all products
export const getAllProducts = async (req, res, next) => {
    try {
        const products = await Product.find()
        res.json(products)
    } catch (err) {
        next(err)
    }
}

// get single product
export const getProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id)
        if (!product)
            return res.status(404).json({ message: "Product not found" })
        res.json(product)
    } catch (err) {
        next(err)
    }
}

// add new product
export const addProduct = async (req, res, next) => {
    try {
        const { name, description, price, stock } = req.body
        const product = new Product({ name, description, price, stock })
        await product.save()
        res.status(201).json(product)
    } catch (err) {
        next(err)
    }
}

// update product
export const updateProduct = async (req, res, next) => {
    try {
        const { name, description, price, stock } = req.body
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { name, description, price, stock },
            { new: true }
        )
        if (!product)
            return res.status(404).json({ message: "Product not found" })
        res.json(product)
    } catch (err) {
        next(err)
    }
}

// delete product
export const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id)
        if (!product)
            return res.status(404).json({ message: "Product not found" })
        res.json({ message: "Product deleted" })
    } catch (err) {
        next(err)
    }
}

// update stock
export const updateStock = async (req, res, next) => {
    try {
        const { quantity } = req.body
        const product = await Product.findById(req.params.id)
        if (!product)
            return res.status(404).json({ message: "Product not found" })
        product.stock = quantity
        await product.save()
        res.json(product)
    } catch (err) {
        next(err)
    }
}
