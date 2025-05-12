import { Order } from "../models/Order.js"
import { User } from "../models/User.js"

// Get all orders
export const getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find().populate("customerId", "name email") // Populating customer information
        res.status(200).json(orders)
    } catch (err) {
        next(err)
    }
}

// Get single order by ID
export const getOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate(
            "customerId",
            "name email"
        )
        if (!order) {
            return res.status(404).json({ message: "Order not found" })
        }
        res.status(200).json(order)
    } catch (err) {
        next(err)
    }
}

// Create a new order
export const createOrder = async (req, res, next) => {
    try {
        const { customerId, items, total, status, address } = req.body

        // Validate customer existence
        const customer = await User.findById(customerId)
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" })
        }

        // Create the new order
        const order = new Order({
            customerId,
            items,
            total,
            status,
            address,
            createdAt: new Date()
        })
        await order.save()
        res.status(201).json(order)
    } catch (err) {
        next(err)
    }
}

// Update order status by ID
export const updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        )
        if (!order) {
            return res.status(404).json({ message: "Order not found" })
        }
        res.status(200).json(order)
    } catch (err) {
        next(err)
    }
}

// Delete order by ID
export const deleteOrder = async (req, res, next) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id)
        if (!order) {
            return res.status(404).json({ message: "Order not found" })
        }
        res.status(200).json({ message: "Order deleted" })
    } catch (err) {
        next(err)
    }
}
