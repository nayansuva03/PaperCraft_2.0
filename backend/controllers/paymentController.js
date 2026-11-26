import crypto from "crypto";
import razorpay from "../config/razorpay.js";
import Subscription from "../models/Subscription.js";
import User from "../models/Users.js";

const PLANS = {
  Basic: { amount: 1, tokens: 60, savedServicesLimit: 25, days: 2, ads: true },
  Pro: { amount: 2, tokens: 150, savedServicesLimit: 110, days: 2, ads: false },
  Ultra: {
    amount: 3,
    tokens: 250,
    savedServicesLimit: 300,
    days: 3,
    ads: false,
  },
};

export const createOrder = async (req, res) => {
  try {
    const { plan } = req.body;
    const selected = PLANS[plan];
    if (!selected) {
      return res.status(400).json({ success: false, message: "Invalid plan." });
    }

    const order = await razorpay.orders.create({
      amount: selected.amount * 100, // paise
      currency: "INR",
      receipt: `rcpt_${req.user.id.toString().slice(-8)}_${Date.now()}`,
      notes: { userId: req.user.id, plan },
    });

    return res.status(200).json({ success: true, order });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to create order." });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } =
      req.body;
    const selected = PLANS[plan];
    if (!selected) {
      return res.status(400).json({ success: false, message: "Invalid plan." });
    }

    // 1. Verify signature
    

const expected = crypto
  .createHmac("sha256", process.env.LIVE_RAZORPAY_SECRET)
  .update(razorpay_order_id + "|" + razorpay_payment_id)
  .digest("hex");

    if (expected !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature." });
    }

    // 2. Confirm the order really belongs to this user and plan
    const order = await razorpay.orders.fetch(razorpay_order_id);
    if (
      order.notes?.userId !== req.user.id.toString() ||
      order.notes?.plan !== plan
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Order mismatch." });
    }

    // 3. Activate / upgrade the subscription
    const expiresAt = new Date(
      Date.now() + selected.days * 24 * 60 * 60 * 1000,
    );

    const subscription = await Subscription.findOneAndUpdate(
      { user: req.user.id },
      {
        plan,
        tokens: selected.tokens,
        savedServicesLimit: selected.savedServicesLimit,
        status: "active",
        expiresAt,
        lastPaymentId: razorpay_payment_id,
      },
      { new: true, upsert: true },
    );

    await User.findByIdAndUpdate(req.user.id, {
      subscription: subscription._id,
    });

    return res
      .status(200)
      .json({ success: true, message: "Payment verified.", subscription });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Payment verification failed." });
  }
};
