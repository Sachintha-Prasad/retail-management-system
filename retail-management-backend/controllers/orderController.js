import { Order } from "../models/order.js"

// create order
export const createOrder = async (req, res, next) => {
    try {
        const { customerName, cartItems } = req.body
        const order = new Order({ customerName, cartItems })
        await order.save()
        res.status(201).json(order)
    } catch (err) {
        next(err)
    }
}

// get all orders
export const getOrders = async (req, res, next) => {
    try {
        const orders = await Order.find()
        res.json(orders)
    } catch (err) {
        next(err)
    }
}
