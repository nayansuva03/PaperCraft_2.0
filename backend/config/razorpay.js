import Razorpay from "razorpay";
import "dotenv/config"

const razorpay = new Razorpay({
  key_id: process.env.TEST_RAZORPAY_API_KEY,
  key_secret: process.env.TEST_RAZORPAY_SECRET,
});

export default razorpay;