import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    refreshTokenHash: {
      type: String,
      required: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { _id: true },
);

const usersSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Optional because Google users don't have a local password.
    password: {
      type: String,
      required: false,
    },

    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    // Only exists for Google accounts.
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },

    // Active login sessions/devices.
    sessions: [sessionSchema],

    // Reference to the user's current subscription.
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subscription",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Users", usersSchema);
