import { Router } from "express";
import {
  register,
  login,
  logout,
  getUser,
} from "../controllers/user.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protect, getUser);

export default router;
