import mongoose from "mongoose"

const orderSchema = new mongoose.Schema(
    {
        customerName: String,
        cartItems: [
            {
                productId: mongoose.Schema.Types.ObjectId,
                quantity: Number
            }
        ]
    },
    { timestamps: true }
)

export const Order = mongoose.model("Order", orderSchema)
