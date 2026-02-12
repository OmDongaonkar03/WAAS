import express from "express";
import {
  getProfile,
  updateProfile,
  requestEmailChange,
  verifyEmailChange,
  uploadProfilePhoto,
  deleteProfilePhoto,
  changePassword,
  deleteAccount,
  getStats,
} from "../controllers/profile.controller.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// Profile management routes (protected)
router.get("/", authenticate, getProfile);
router.put("/", authenticate, updateProfile);

// Email change routes
router.post("/email/request", authenticate, requestEmailChange);
router.post("/email/verify", verifyEmailChange); // Public route - uses token in body

// Photo management (protected)
router.post("/photo", authenticate, uploadProfilePhoto);
router.delete("/photo", authenticate, deleteProfilePhoto);

// Password management (protected)
router.put("/password", authenticate, changePassword);

// Statistics (protected)
router.get("/stats", authenticate, getStats);

// Account deletion (protected)
router.delete("/", authenticate, deleteAccount);

export default router;