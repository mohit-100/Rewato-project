import express from "express";
import { sendOtp, verifyOtp, completeProfile } from "../controllers/riderController.js";
import { authenticateUser } from "../middleware/authMiddleware.js"; 

const router = express.Router();


router.post("/send-otp", sendOtp);


router.post("/verify-otp", verifyOtp);


router.put("/complete-profile", authenticateUser, completeProfile);

export default router;
