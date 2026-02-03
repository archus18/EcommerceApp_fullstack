import jwt from "jsonwebtoken";
import User from "../model/userModel.js";

/**
 * ✅ authentication middleware
 * - checks token
 * - sets req.userId, req.role
 * - loads user and sets req.user
 */
const authentication = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization; // "Bearer <token>"
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Support both: old token {id} and new token {userId}
    const userId = decoded.userId || decoded.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: Invalid token payload" });
    }

    req.userId = userId;
    req.role = decoded.role;

    // ✅ attach full user to req.user (needed for reviews name)
    const user = await User.findById(userId).select("firstName lastName email role");
    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

/**
 * ✅ authorization middleware (admin only)
 */
const authorization = (req, res, next) => {
  try {
    if (req.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admin access required" });
    }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export { authentication, authorization };
