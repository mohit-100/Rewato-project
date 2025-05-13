import mongoose from "mongoose";

const riderSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  isPhoneVerified: {
    type: Boolean,
    default: false,
  },
  otp: {
    code: String,
    expiresAt: Date,
  },
  name: String,
  email: {
    type: String,
    match: [/.+\@.+\..+/, "Please fill a valid email address"],
  },
  age: {
    type: Number,
    min: 18,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
  },
  vehicle: {
    type: {
      type: String,
      enum: ["bike", "scooter", "car", "auto", "other"],
    },
    number: String,
    model: String,
  },
  role: {
    type: String,
    default: "rider",
    enum: ["rider"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const RiderModel = mongoose.model("Rider", riderSchema);
export default RiderModel;
