import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynHandler.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,

  auth: {
    user: "vincenzo.quigley4@ethereal.email",
    pass: "M9DmJKDMazAaJpqW3x",
  },
});
const userRegister = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if ([name, email, password].some((item) => item?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    throw new ApiError(400, "Email already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, user, "User Registered Successfully"));
});

const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordValild = await user.isPasswordCorrect(password);
  if (!isPasswordValild) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const authToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
  const refreshToken = jwt.sign(
    { _id: user._id },
    process.env.JWT_REFRESH_SECRET_KEY,
    {
      expiresIn: "10d",
    }
  );

  return res
    .cookie("authToken", authToken, { httpOnly: true })
    .cookie("refreshToken", refreshToken, { httpOnly: true })
    .status(200)
    .json(new ApiResponse(200, { authToken }, "User logged in successfully"));
});

const sendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 90000);
  const mailOptions = {
    from: process.env.COMPANY_EMAIL,
    to: email,
    subject: "Verification OTP",
    text: `Your OTP is ${otp}`,
  };
  transporter.sendMail(mailOptions, async (err, info) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: err.message });
    } else {
      return res
        .status(200)
        .json(new ApiResponse(200, otp, "OTP sent successfully"));
    }
  });
});

const checkLogin = asyncHandler(async (req, res) => {
  return res.json({
    ok: true,
    message: "User authenticated successfully",
  });
});
export { userRegister, userLogin, sendOTP, checkLogin };
