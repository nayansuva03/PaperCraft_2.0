import mongoose from "mongoose";

const AI_Data = new mongoose.Schema(
  {
    inputTokens: {
      type: Number,
    },

    outputTokens: {
      type: Number,
    },

    totalTokens: {
      type: Number,
    },

    success: {
      type: Boolean,
    },

    error: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("AI_Data", AI_Data);
