import Subscription from "../models/Subscription.js";
import User from "../models/Users.js";

export const knowsubscription = async (req, res) => {
  try {
    const userId = req.user.id;

    const existingsubscription = await Subscription.findOne({
      user: userId,
    });

    if (!existingsubscription) {
      return res.status(409).json({
        success: false,
        message: "subscription Don't exists.",
      });
    }

    if (
      existingsubscription.expiresAt &&
      existingsubscription.expiresAt <= new Date()
    ) {
      existingsubscription.status = "expired";
      await existingsubscription.save();
    }

    return res.status(200).json({
      success: true,
      message: "Found subscription Details.",
      subscription: existingsubscription,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to Fetch subscription Details.",
    });
  }
};

export const startFreeTrial = async (req, res) => {
  try {
    const userId = req.user.id;

    const existingsubscription = await Subscription.findOne({
      user: userId,
    });

    if (existingsubscription) {
      return res.status(409).json({
        success: false,
        message: "subscription already exists.",
      });
    }

    const newSubscription = await Subscription.create({
      user: userId,
      plan: "Free",
      tokens: 10,
      savedServicesLimit: 5,
      pdfPageLimit: 50,
      status: "active",
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    await User.findByIdAndUpdate(userId, {
      subscription: newSubscription._id,
    });

    return res.status(201).json({
      success: true,
      message: "Free trial activated.",
      subscription: newSubscription,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to activate free trial.",
    });
  }
};
