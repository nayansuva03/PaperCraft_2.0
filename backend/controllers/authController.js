import User from "../models/Users.js";
import OTP from "../models/OTP.js";
import { generateOTP } from "../utils/generateOTP.js";
import bcrypt from "bcryptjs";
import sendEmail from "../utils/sendEmail.js";
import generateAccessToken from "../utils/generateAccessToken.js";
import generateRefreshToken from "../utils/generateRefreshToken.js";
import setAuthCookies from "../utils/setAuthCookies.js";
import jwt from "jsonwebtoken";
import hashRefreshToken from "../utils/hashRefreshToken.js";
import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const signup = async (req, res) => {
  try {
    let { firstName, lastName, email, password, confirmPassword } = req.body;

    if (!firstName || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }
    firstName = firstName.trim();
    lastName = (lastName || "").trim();
    email = email.trim().toLowerCase();
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "This Email already registered.",
      });
    }

    const otp = generateOTP();
    await OTP.deleteMany({ email });
    await OTP.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });
    await sendEmail({
      to: email,
      subject: "PaperCraft Email Verification",
      html: `
    <h2>Welcome to PaperCraft!</h2>
    <p>Your verification code is:</p>
    <h1 style="letter-spacing:5px;">${otp}</h1>
    <p>This code will expire in <strong>5 minutes</strong>.</p>
    <p>If you didn't request this, you can safely ignore this email.</p>
  `,
    });
    return res.status(200).json({
      success: true,
      message: "OTP is Created and Sent Successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const resendSignupOTP = async (req, res) => {
  try {
    let { firstName, lastName, email, password, confirmPassword } = req.body;

    if (!firstName || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }
    firstName = firstName.trim();
    lastName = (lastName || "").trim();
    email = email.trim().toLowerCase();
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "This Email already registered.",
      });
    }

    const otp = generateOTP();
    await OTP.deleteMany({ email });
    await OTP.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });
    await sendEmail({
      to: email,
      subject: "PaperCraft Email Verification",
      html: `
    <h2>Welcome to PaperCraft!</h2>
    <p>Your verification code is:</p>
    <h1 style="letter-spacing:5px;">${otp}</h1>
    <p>This code will expire in <strong>5 minutes</strong>.</p>
    <p>If you didn't request this, you can safely ignore this email.</p>
  `,
    });
    return res.status(200).json({
      success: true,
      message: "OTP is Created and Sent Successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifySignupOTP = async (req, res) => {
  try {
    let formData = req.body.formData;
    let { otp } = req.body;

    if (!formData || !otp) {
      return res.status(400).json({
        success: false,
        message: "OTP are required.",
      });
    }
    let email = formData.email.trim().toLowerCase();
    otp = otp.trim();
    const otpDoc = await OTP.findOne({ email });

    if (!otpDoc) {
      return res.status(404).json({
        success: false,
        message: "OTP not found or expired.",
      });
    }
    if (new Date() > otpDoc.expiresAt) {
      await OTP.deleteOne({ _id: otpDoc._id });

      return res.status(400).json({
        success: false,
        message: "OTP has expired.",
      });
    }
    if (otpDoc.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
    }
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "This email is already registered.",
      });
    }
    const hashedPassword = await bcrypt.hash(formData.password, 10);
    const newUser = await User.create({
      firstName: formData.firstName,
      lastName: formData.lastName || "",
      email: formData.email,
      password: hashedPassword,
      isVerified: true,
    });

    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    const refreshTokenHash = hashRefreshToken(refreshToken);

    newUser.sessions.push({
      refreshTokenHash,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    await newUser.save();

    setAuthCookies(res, accessToken, refreshToken);
    await OTP.deleteOne({ _id: otpDoc._id });

    return res.status(201).json({
      success: true,
      message: "New User Created.",
      user: {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        authProvider: newUser.authProvider,
        subscription: newUser.subscription,
        isRegistered: true,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    email = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Google-only accounts have no password yet (can be added later from the
    // Advance Options page). Without this guard bcrypt.compare throws a 500.
    if (!existingUser.password) {
      return res.status(401).json({
        success: false,
        message:
          "This account was created with Google. Please sign in with Google.",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password,
    );

    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password." });
    }
    const accessToken = generateAccessToken(existingUser);
    const refreshToken = generateRefreshToken(existingUser);

    const refreshTokenHash = hashRefreshToken(refreshToken);

    existingUser.sessions.push({
      refreshTokenHash,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    await existingUser.save();

    setAuthCookies(res, accessToken, refreshToken);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      user: {
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        email: existingUser.email,
        authProvider: existingUser.authProvider,
        subscription: existingUser.subscription,
        isRegistered: true,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    let { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please Enter Email.",
      });
    }
    email = email.trim().toLowerCase();
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "The Email Doesn't exist.",
      });
    }
    await OTP.deleteMany({ email });
    const otp = generateOTP();
    await OTP.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });
    await sendEmail({
      to: email,
      subject: "PaperCraft Email Verification",
      html: `
    <h2>Reset Password request from PaperCraft!</h2>
    <p>Your verification code is:</p>
    <h1 style="letter-spacing:5px;">${otp}</h1>
    <p>This code will expire in <strong>5 minutes</strong>.</p>
    <p>If you didn't request this, you can safely ignore this email.</p>
  `,
    });
    return res.status(200).json({
      success: true,
      message: "OTP is Created and Sent Successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyForgotOTP = async (req, res) => {
  try {
    let { email, otp } = req.body;
    if (!otp || !email) {
      return res.status(400).json({
        success: false,
        message: "OTP and Email Reqired.",
      });
    }
    const trueOTP = await OTP.findOne({ email });

    if (!trueOTP) {
      return res.status(404).json({
        success: false,
        message: "OTP not found or expired.",
      });
    }

    if (new Date() > trueOTP.expiresAt) {
      await OTP.deleteOne({ _id: trueOTP._id });

      return res.status(400).json({
        success: false,
        message: "OTP has expired.",
      });
    }
    if (trueOTP.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
    }
    trueOTP.verified = true;
    await trueOTP.save();
    return res.status(200).json({
      success: true,
      message: "OTP verifyed Successfully.",
    });
  } catch (error) {
    console.error("Verify Forgot OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export const resendForgotPasswordOTP = async (req, res) => {
  try {
    let { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please Enter Email.",
      });
    }
    email = email.trim().toLowerCase();
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "The Email Doesn't exist.",
      });
    }
    await OTP.deleteMany({ email });
    const otp = generateOTP();
    await OTP.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });
    await sendEmail({
      to: email,
      subject: "PaperCraft Email Verification",
      html: `
    <h2>Reset Password request from PaperCraft!</h2>
    <p>Your verification code is:</p>
    <h1 style="letter-spacing:5px;">${otp}</h1>
    <p>This code will expire in <strong>5 minutes</strong>.</p>
    <p>If you didn't request this, you can safely ignore this email.</p>
  `,
    });
    return res.status(200).json({
      success: true,
      message: "OTP is Created and Sent Successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    email = email.trim().toLowerCase();
    const verifiedOtp = await OTP.findOne({ email, verified: true });
    if (!verifiedOtp) {
      return res
        .status(403)
        .json({ success: false, message: "OTP verification required." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.updateOne(
      { email },
      {
        $set: {
          password: hashedPassword,
          sessions: [],
        },
      },
    );
    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);
    await OTP.deleteMany({ email });
    return res.status(200).json({
      success: true,
      message: "Password Reset Successfully.",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const existingUser = await User.findById(req.user.id);

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Current user fetched successfully.",
      user: {
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        email: existingUser.email,
        authProvider: existingUser.authProvider,
        subscription: existingUser.subscription,
      },
    });
  } catch (error) {
    console.error("Get Current User Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

const clearAuthCookies = (res) => {
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  };

  res.clearCookie("accessToken", options);
  res.clearCookie("refreshToken", options);
};

export default clearAuthCookies;

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      const refreshTokenHash = hashRefreshToken(refreshToken);

      await User.updateOne(
        { "sessions.refreshTokenHash": refreshTokenHash },
        {
          $pull: {
            sessions: {
              refreshTokenHash,
            },
          },
        },
      );
    }
    clearAuthCookies(res);
    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    console.error("Logout Error:", error);

    return res.status(500).json({
      success: false,
      message: "Logout failed.",
    });
  }
};
export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token missing.",
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const refreshTokenHash = hashRefreshToken(refreshToken);

    const user = await User.findOne({
      _id: decoded.id,
      "sessions.refreshTokenHash": refreshTokenHash,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token.",
      });
    }

    const session = user.sessions.find(
      (session) => session.refreshTokenHash === refreshTokenHash,
    );

    if (!session || session.expiresAt < new Date()) {
      return res.status(401).json({
        success: false,
        message: "Refresh token expired.",
      });
    }

    const newAccessToken = generateAccessToken(user);

    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 15 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Access token refreshed.",
    });
  } catch (error) {
    console.error("Refresh Token Error:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired refresh token.",
    });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google credential is required.",
      });
    }

    // Verify Google ID token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const {
      sub: googleId,
      email,
      given_name,
      family_name,
      email_verified,
    } = payload;

    if (!email || !email_verified) {
      return res.status(401).json({
        success: false,
        message: "Google account email could not be verified.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check Google account
    let existingUser = await User.findOne({
      googleId,
    });

    // Google account doesn't exist yet
    if (!existingUser) {
      // Check whether email already belongs to another account
      const emailUser = await User.findOne({
        email: normalizedEmail,
      });

      if (emailUser) {
        // Safety net: this email is already linked to a different Google account.
        if (emailUser.googleId && emailUser.googleId !== googleId) {
          return res.status(409).json({
            success: false,
            message:
              "This email is already linked to a different Google account.",
          });
        }

        // Same email, verified by Google (email_verified checked above) and
        // already verified by OTP at signup -> safe to link. The password is
        // left untouched, so the user can now log in with either method.
        emailUser.googleId = googleId;
        await emailUser.save();
        existingUser = emailUser;
      } else {
        // Brand new user -> create Google user
        existingUser = await User.create({
          firstName: given_name || "",
          lastName: family_name || "",
          email: normalizedEmail,
          authProvider: "google",
          googleId,
        });
      }
    }

    // Generate PaperCraft tokens
    const accessToken = generateAccessToken(existingUser);
    const refreshToken = generateRefreshToken(existingUser);

    const refreshTokenHash = hashRefreshToken(refreshToken);

    existingUser.sessions = existingUser.sessions.filter(
      (s) => s.expiresAt > new Date(),
    );

    existingUser.sessions.push({
      refreshTokenHash,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    await existingUser.save();

    // Set PaperCraft authentication cookies
    setAuthCookies(res, accessToken, refreshToken);

    return res.status(200).json({
      success: true,
      message: "Google login successful.",
      user: {
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        email: existingUser.email,
        authProvider: existingUser.authProvider,
        subscription: existingUser.subscription,
        isRegistered: true,
      },
    });
  } catch (error) {
    console.error("Google Login Error:", error);

    return res.status(401).json({
      success: false,
      message: "Google authentication failed.",
    });
  }
};
