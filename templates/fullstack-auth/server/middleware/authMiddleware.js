import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// JWT from Authorization: Bearer or cookies.token; sets req.user or 401.

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token && req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: "Not authorised - no token provided." });
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    return res.status(401).json({
      message: "Not authorised",
    });
  }

  let decoded;

  try {
    decoded = jwt.verify(token, jwtSecret);
  } catch {
    return res
      .status(401)
      .json({ message: "Not authorised - token is invalid or expired." });
  }

  const userId = decoded?.id;
  if (!userId) {
    return res.status(401).json({
      message: "Not authorised",
    });
  }

  let user;
  try {
    user = await User.findById(userId);
  } catch {
    return res.status(401).json({
      message: "Not authorised",
    });
  }

  if (!user) {
    return res.status(401).json({ message: "Not authorised" });
  }

  req.user = user;
  next();
});
