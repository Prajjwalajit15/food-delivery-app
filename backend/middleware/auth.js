import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
    const { token } = req.headers; // Assuming the token is directly in `req.headers.token`
    if (!token) {
        return res.status(401).json({ success: false, message: "Not Authorized. Please log in again." });
    }
    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET); // Decode the token
        req.body.userId = token_decode.id; // Assign only the `id` field to `req.body.userId`
        next(); // Move to the next middleware or route handler
    } catch (error) {
        console.error("Error verifying token:", error);
        return res.status(401).json({ success: false, message: "Invalid token. Please log in again." });
    }
};

export default authMiddleware;
