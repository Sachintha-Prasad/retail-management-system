import { Cart } from "../models/Cart.js"
import { Product } from "../models/Product.js"
import { User } from "../models/User.js"

// Add to cart
export const addToCart = async (req, res, next) => {
    try {
        const { customerId, productId, quantity } = req.body

        // Find the product to add to the cart
        const product = await Product.findById(productId)
        if (!product)
            return res.status(404).json({ message: "Product not found" })

        // Check if the user exists
        const user = await User.findById(customerId)
        if (!user) return res.status(404).json({ message: "User not found" })

        // Check if the cart exists for the user
        let cart = await Cart.findOne({ customerId })
        const itemTotal = product.price * quantity

        if (!cart) {
            // Create a new cart if it doesn't exist
            cart = new Cart({
                customerId,
                items: [
                    {
                        productId,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                        quantity
                    }
                ],
                total: itemTotal
            })
        } else {
            // Update the existing cart
            const index = cart.items.findIndex((item) =>
                item.productId.equals(productId)
            )
            if (index >= 0) {
                cart.items[index].quantity += quantity
            } else {
                cart.items.push({
                    productId,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity
                })
            }

            // Recalculate total price
            cart.total = cart.items.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
            )
        }

        await cart.save()
        res.status(200).json(cart)
    } catch (err) {
        next(err)
    }
}

// Get cart by user (customer)
export const getCart = async (req, res, next) => {
    try {
        const { customerId } = req.params

        // Find cart by user
        const cart = await Cart.findOne({ customerId })
        if (!cart) return res.status(404).json({ message: "Cart not found" })

        res.status(200).json(cart)
    } catch (err) {
        next(err)
    }
}

// Update cart item quantity
export const updateCartItem = async (req, res, next) => {
    try {
        const { customerId, productId, quantity } = req.body

        // Find the user's cart
        const cart = await Cart.findOne({ customerId })
        if (!cart) return res.status(404).json({ message: "Cart not found" })

        // Find the product in the cart and update quantity
        const itemIndex = cart.items.findIndex((item) =>
            item.productId.equals(productId)
        )
        if (itemIndex >= 0) {
            cart.items[itemIndex].quantity = quantity
        } else {
            return res
                .status(404)
                .json({ message: "Product not found in cart" })
        }

        // Recalculate total price
        cart.total = cart.items.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
        )

        await cart.save()
        res.status(200).json(cart)
    } catch (err) {
        next(err)
    }
}

// Remove product from cart
export const removeFromCart = async (req, res, next) => {
    try {
        const { customerId, productId } = req.body

        // Find the user's cart
        const cart = await Cart.findOne({ customerId })
        if (!cart) return res.status(404).json({ message: "Cart not found" })

        // Remove the item from the cart
        const newItems = cart.items.filter(
            (item) => !item.productId.equals(productId)
        )
        cart.items = newItems

        // Recalculate total price
        cart.total = cart.items.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
        )

        await cart.save()
        res.status(200).json(cart)
    } catch (err) {
        next(err)
    }
}

// Clear the cart
export const clearCart = async (req, res, next) => {
    try {
        const { customerId } = req.body

        // Find the user's cart
        const cart = await Cart.findOne({ customerId })
        if (!cart) return res.status(404).json({ message: "Cart not found" })

        // Clear the cart
        cart.items = []
        cart.total = 0

        await cart.save()
        res.status(200).json({ message: "Cart cleared successfully" })
    } catch (err) {
        next(err)
    }
}
