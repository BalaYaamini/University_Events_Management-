const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const sendOTP = require("../utils/sendOTP"); // make sure you have this
const otpStore = {};
const allowedDomain = "@cse.suh.edu.in";

const isValidDomain = (email) => {
  const parts = email.split("@");

  if (parts.length !== 2) return false;

  const domain = parts[1].toLowerCase();

  return domain === "suh.edu.in" || domain.endsWith(".suh.edu.in");
};


exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const record = otpStore[email];

    if (!record || !record.verified) {
      return res.status(400).json({ message: "Please verify email first" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
if (!isValidDomain(email)) {
  return res.status(400).json({
    message: "Only SUH university emails are allowed"
  });
}

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    // Remove from memory after successful registration
    delete otpStore[email];

    res.status(201).json({ message: "Registration successful" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};



exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!isValidDomain(email)) {
  return res.status(400).json({
    message: "Only SUH university emails are allowed"
  });
}


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      role: user.role,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.sendOTPForRegister = async (req, res) => {
  const { email } = req.body;

  try {
    const existingUser = await User.findOne({ email });

   if (!isValidDomain(email)) {
  return res.status(400).json({
    message: "Only SUH university emails are allowed"
  });
}


    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore[email] = {
      otp,
      expires: Date.now() + 10 * 60 * 1000,
      verified: false,
    };

    await sendOTP(email, otp);

    res.json({ message: "OTP sent to email" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};



exports.verifyEmailOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const record = otpStore[email];

    if (!record) {
      return res.status(400).json({ message: "No OTP found" });
    }

    if (record.expires < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    if (record.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    record.verified = true;

    res.json({ message: "Email verified successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};



