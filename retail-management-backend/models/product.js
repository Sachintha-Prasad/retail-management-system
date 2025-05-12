import mongoose from "mongoose"

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        price: { type: Number, required: true },
        image: { type: String },
        category: { type: String },
        stock: { type: Number, required: true },
        featured: { type: Boolean, default: false }
    },
    { timestamps: true }
)

export const Product = mongoose.model("Product", productSchema)
