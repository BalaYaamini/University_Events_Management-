import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
const [error, setError] = useState("");
const [success, setSuccess] = useState("");

const navigate = useNavigate();
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!email || !password || !role) {
    setError("All fields are required");
    setSuccess("");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        role,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || "Login failed");
      setSuccess("");
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);

    setSuccess("Login successful!");
    setError("");

    setTimeout(() => {
      if (data.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/student-dashboard");
      }
    }, 1200);

  } catch (error) {
    setError("Server error");
    setSuccess("");
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          Login
        </h2>
        {error && (
  <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
)}

{success && (
  <p className="text-green-600 text-sm mb-4 text-center">{success}</p>
)}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
  <label className="block text-gray-600 mb-2 font-medium">
    Login as
  </label>

  <div className="flex gap-6">
    <label className="flex items-center gap-2">
      <input
        type="radio"
        value="student"
        checked={role === "student"}
        onChange={() => setRole("student")}
      />
      Student
    </label>

    <label className="flex items-center gap-2">
      <input
        type="radio"
        value="admin"
        checked={role === "admin"}
        onChange={() => setRole("admin")}
      />
      Admin
    </label>
  </div>
</div>

          <div className="mb-4">
            <label className="block text-gray-600 mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-600 mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Login
          </button>
          <p className="text-sm text-center mt-4">
  Don't have an account?{" "}
  <span
    className="text-blue-600 cursor-pointer"
    onClick={() => navigate("/register")}
  >
    Create one
  </span>
</p>

        </form>
      </div>
    </div>
  );
}

export default Login;
