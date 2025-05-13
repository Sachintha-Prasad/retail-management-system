import mongoose from "mongoose"

const orderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    quantity: { type: Number, required: true }
})

const addressSchema = new mongoose.Schema({
    line1: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true }
})

const orderSchema = new mongoose.Schema(
    {
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        items: [orderItemSchema],
        total: { type: Number, required: true },
        status: {
            type: String,
            enum: ["pending", "shipped", "delivered"],
            default: "pending"
        },
        address: addressSchema
    },
    { timestamps: true }
)

export const Order = mongoose.model("Order", orderSchema)
