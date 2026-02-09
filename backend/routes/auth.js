import express from "express";
import {
  signup,
  login,
  googleCallback,
  refresh,
  me,
  logout,
  verifyEmail,
  resendVerification,
  forgotPassword,
  validateResetToken,
  resetPassword,
  completeOnboarding,
} from "../controllers/auth.controller.js";

const router = express.Router();

// Authentication routes
router.post("/signup", signup);
router.post("/login", login);
router.get("/google/callback", googleCallback);

// Email verification routes (consolidated in auth)
router.post("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerification);

// Token & session management
router.post("/refresh", refresh);
router.get("/me", me);
router.post("/logout", logout);

// Password reset routes
router.post("/forgot-password", forgotPassword);
router.post("/validate-reset-token", validateResetToken);
router.post("/reset-password", resetPassword);

// Onboarding
router.post("/complete-onboarding", completeOnboarding);

export default router;