import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  signup,
  verifySignupOTP,
  login,
  forgotPassword,
  verifyForgotOTP,
  resetPassword,
  getCurrentUser,
  logout,
  refreshAccessToken,
  resendSignupOTP,
  resendForgotPasswordOTP,
  googleLogin,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/verify-signup", verifySignupOTP);
router.post("/login", login);
router.post("/google", googleLogin);

router.post("/forgot-password", forgotPassword);
router.post("/verify-forgot-password", verifyForgotOTP);
router.post("/reset-password", resetPassword);

router.post("/resend-signup-otp", resendSignupOTP);
router.post("/resend-forgot-password-otp", resendForgotPasswordOTP);

router.get("/me", authMiddleware, getCurrentUser);

router.post("/refresh-token", refreshAccessToken);
router.post("/logout", logout);

export default router;
