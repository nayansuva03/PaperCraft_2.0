import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  startFreeTrial,
  knowsubscription,
} from "../controllers/subscriptionController.js";

const router = express.Router();

router.post("/free-trial", authMiddleware, startFreeTrial);
router.post("/know-subscription", authMiddleware, knowsubscription);

export default router;
