import Rider from "../Model/RiderModel.js";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import twilio from "twilio";

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Generate OTP
const generateOtp = () => ({
  code: Math.floor(100000 + Math.random() * 900000).toString(),
  expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
});

// 1️⃣ Send OTP
export const sendOtp = async (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    const err = new Error("Phone number is required");
    err.statusCode = StatusCodes.BAD_REQUEST;
    throw err;
  }

  const otp = generateOtp();
  let rider = await Rider.findOne({ phone });

  if (!rider) {
    rider = await Rider.create({ phone, otp });
  } else {
    rider.otp = otp;
    await rider.save();
  }

  try {
    await twilioClient.messages.create({
      body: `Your OTP code is ${otp.code}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone.startsWith("+") ? phone : `+91${phone}`,
    });

    res.status(StatusCodes.OK).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Twilio Error:", error.message);
    const err = new Error("Failed to send OTP. Please try again.");
    err.statusCode = StatusCodes.BAD_REQUEST;
    throw err;
  }
};

// 2️⃣ Verify OTP
export const verifyOtp = async (req, res) => {
  const { phone, code } = req.body;
  if (!phone || !code) {
    const err = new Error("Phone and OTP code are required");
    err.statusCode = StatusCodes.BAD_REQUEST;
    throw err;
  }

  const rider = await Rider.findOne({ phone });
  if (!rider || !rider.otp) {
    const err = new Error("Rider not found or OTP expired");
    err.statusCode = StatusCodes.UNAUTHORIZED;
    throw err;
  }

  const isOtpValid = rider.otp.code === code && new Date() < rider.otp.expiresAt;
  if (!isOtpValid) {
    const err = new Error("Invalid or expired OTP");
    err.statusCode = StatusCodes.UNAUTHORIZED;
    throw err;
  }

  rider.isPhoneVerified = true;
  rider.otp = undefined;
  await rider.save();

  const token = jwt.sign({ id: rider._id, role: rider.role }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.status(StatusCodes.OK).json({ message: "OTP verified", token });
};

// 3️⃣ Complete Profile
export const completeProfile = async (req, res) => {
  const { name, email, age, gender, vehicle } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    const err = new Error("Unauthorized");
    err.statusCode = StatusCodes.UNAUTHORIZED;
    throw err;
  }

  const rider = await Rider.findById(userId);
  if (!rider || !rider.isPhoneVerified) {
    const err = new Error("Phone not verified");
    err.statusCode = StatusCodes.UNAUTHORIZED;
    throw err;
  }

  rider.name = name || rider.name;
  rider.email = email || rider.email;
  rider.age = age || rider.age;
  rider.gender = gender || rider.gender;
  rider.vehicle = vehicle || rider.vehicle;

  await rider.save();

  res.status(StatusCodes.OK).json({ message: "Profile updated", rider });
};
