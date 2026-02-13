const express = require("express");
const router = express.Router();
// const { login, register } = require("../controllers/authController");
// const { login, register, verifyOTP } = require("../controllers/authController");

// router.post("/verify-otp", verifyOTP);
const { 
  login, 
  register, 
  sendOTPForRegister, 
  verifyEmailOTP 
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/send-otp", sendOTPForRegister);
router.post("/verify-email", verifyEmailOTP);

module.exports = router;
