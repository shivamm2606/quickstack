import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const SALT_ROUNDS = 10;
const JWT_EXPIRES = "7d";

const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: JWT_EXPIRES });

const attachCookie = (res, token) =>
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  });

// POST /api/user/register

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields are required." });

  const existing = await User.findOne({ email });
  if (existing)
    return res.status(409).json({ message: "Email already in use." });

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const user   = await User.create({ name, email, password: hashed });

  const token = signToken(user._id);
  attachCookie(res, token);

  res.status(201).json({
    token,
    user: { id: user._id, name: user.name, email: user.email },
  });
});

// POST /api/user/login

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required." });

  const user = await User.findOne({ email }).select("+password");
  if (!user)
    return res.status(401).json({ message: "Invalid credentials." });

  const match = await bcrypt.compare(password, user.password);
  if (!match)
    return res.status(401).json({ message: "Invalid credentials." });

  const token = signToken(user._id);
  attachCookie(res, token);

  res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email },
  });
});

// POST /api/user/logout

export const logout = (_req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  return res.status(200).json({ message: "Logged out successfully" });
};

// GET /api/user/me (protect)
export const getUser = asyncHandler(async (req, res) => {
  const { _id, name, email } = req.user;
  res.json({ id: _id, name, email });
});
