const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const sendOTP = require("../utils/sendOTP"); // make sure you have this

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // 1️⃣ Validate fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(name)) {
      return res.status(400).json({ message: "Name must contain only letters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: "Password must be strong" });
    }

    // 2️⃣ Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      otp,
      otpExpires: Date.now() + 10 * 60 * 1000, // 10 minutes expiry
      isVerified: false,
    });

    await newUser.save();

    // 5️⃣ Send OTP email
    await sendOTP(email, otp);

    // 6️⃣ Respond
    res.status(201).json({ message: "OTP sent to email" });

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
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store temporarily (you can use DB or memory for now)
    await sendOTP(email, otp);

    res.json({ message: "OTP sent to email" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


exports.verifyEmailOTP = async (req, res) => {
  const { email, otp } = req.body;

  // compare with stored OTP
  // if correct:
  res.json({ message: "Email verified" });
};




