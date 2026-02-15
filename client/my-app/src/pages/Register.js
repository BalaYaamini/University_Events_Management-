import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // 1️⃣ SEND OTP
  const sendOTP = async () => {
  try {
    const response = await fetch(
      "http://localhost:5000/api/auth/send-otp",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || "Failed to send OTP");
      setSuccess("");
      return;
    }

    setSuccess("OTP sent to your email");
    setError("");
    setOtpSent(true);
  } catch (error) {
    setError("Server error while sending OTP");
    setSuccess("");
  }
};


  // 2️⃣ VERIFY OTP
const verifyOTP = async () => {
  try {
    const response = await fetch(
      "http://localhost:5000/api/auth/verify-email",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || "Invalid OTP");
      setSuccess("");
      return;
    }

    setSuccess("Email verified successfully!");
    setError("");
    setEmailVerified(true);
  } catch (error) {
    setError("Server error while verifying OTP");
    setSuccess("");
  }
};

  // 3️⃣ FINAL REGISTER
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!emailVerified) {
    setError("Please verify your email first");
    setSuccess("");
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:5000/api/auth/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role: "student",
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || "Registration failed");
      setSuccess("");
      return;
    }

    setSuccess("Account created successfully!");
    setError("");

    setTimeout(() => {
      navigate("/");
    }, 1500);
  } catch (error) {
    setError("Backend server not reachable");
    setSuccess("");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          Create Student Account
        </h2>

        {/* EMAIL INPUT */}
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={emailVerified}
          required
        />
        {error && (
  <p className="text-red-500 text-sm mb-2">{error}</p>
)}

{success && (
  <p className="text-green-600 text-sm mb-2">{success}</p>
)}

        {/* SEND OTP BUTTON */}
        {!otpSent && (
          <button
            onClick={sendOTP}
            className="w-full bg-blue-600 text-white py-2 rounded mb-4 hover:bg-blue-700"
          >
            Send OTP
          </button>
        )}

        {/* OTP FIELD */}
        {otpSent && !emailVerified && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full mb-4 px-4 py-2 border rounded"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button
              onClick={verifyOTP}
              className="w-full bg-purple-600 text-white py-2 rounded mb-4 hover:bg-purple-700"
            >
              Verify OTP
            </button>
          </>
        )}

        {/* SHOW NAME + PASSWORD ONLY AFTER VERIFIED */}
        {emailVerified && (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full Name"
              className="w-full mb-4 px-4 py-2 border rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full mb-6 px-4 py-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Register
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Register;
