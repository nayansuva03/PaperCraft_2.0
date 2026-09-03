import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
      unique: true,
    },

    plan: {
      type: String,
      enum: ["Free", "Basic", "Pro", "Ultra"],
      default: "Free",
    },

    tokens: {
      type: Number,
      default: 10,
      min: 0,
    },

    savedServicesLimit: {
      type: Number,
      default: 5,
      min: 0,
    },

    razorpay_payment_id: {
      type: String,
      default: "",
    },

    razorpay_order_id: {
      type: String,
      default: "",
    },

    razorpay_signature: {
      type: String,
      default: "",
    },

    expiresAt: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ["active", "expired"],
      default: "active",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("subscription", subscriptionSchema);
