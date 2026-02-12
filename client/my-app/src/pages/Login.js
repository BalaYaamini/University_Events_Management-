import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

const navigate = useNavigate();
const handleSubmit = async (e) => {
  e.preventDefault();

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
      alert(data.message || "Invalid credentials");
      return;
    }

    // save role so dashboard stays accessible on refresh
    localStorage.setItem("role", role);

    // redirect based on selected role
    if (role === "admin") {
      navigate("/admin-dashboard");
    } else {
      navigate("/student-dashboard");
    }
  } catch (error) {
    alert("Backend server not reachable");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          Admin Login
        </h2>
        
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
