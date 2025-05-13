import mongoose from "mongoose"

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        price: { type: Number, required: true },
        image: { type: String, required: true },
        category: { type: String, required: true },
        stock: { type: Number, required: true },
        featured: { type: Boolean, default: false }
    },
    {
        timestamps: true,
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id
                delete ret._id
                delete ret.__v
            }
        }
    }
)

export const Product = mongoose.model("Product", productSchema)
