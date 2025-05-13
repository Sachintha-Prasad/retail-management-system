import CustomError from "../utils/customError.js"

const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            throw new CustomError("access denied", 403)
        }

        next()
    }
}

export default authorizeRoles
