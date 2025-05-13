import { User } from "../models/User.js"
import bcrypt from "bcryptjs"

// Register a new user (admin or customer)
export const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body

        // Check if user already exists
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" })
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create new user
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role: role || "customer" // Default to customer if no role is provided
        })

        await user.save()
        res.status(201).json({ message: "User registered successfully", user })
    } catch (err) {
        next(err)
    }
}

// Login user (compares plain password)
export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body

        // Find user by email
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        res.status(200).json({ message: "Login successful", user })
    } catch (err) {
        next(err)
    }
}

// Get user by ID (admin only)
export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        res.status(200).json(user)
    } catch (err) {
        next(err)
    }
}

// Update user details (admin only)
export const updateUser = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body

        // Check if user exists
        const user = await User.findById(req.params.id)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        // Hash password if provided
        const hashedPassword = password
            ? await bcrypt.hash(password, 10)
            : user.password

        // Update user
        user.name = name || user.name
        user.email = email || user.email
        user.password = hashedPassword
        user.role = role || user.role

        await user.save()
        res.status(200).json(user)
    } catch (err) {
        next(err)
    }
}

// Delete user (admin only)
export const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        res.status(200).json({ message: "User deleted" })
    } catch (err) {
        next(err)
    }
}
