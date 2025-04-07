import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const goToHome = () => {
    navigate("/");
  };

  const goToSignup = () => {
    navigate("/register");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const user = await res.json();

      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(user)); // เก็บทั้ง object
        localStorage.setItem("userId", user.id);
        localStorage.setItem("role", user.role);
        localStorage.setItem("email", user.email);

        alert("Login completed!");
        navigate("/"); // กลับหน้าหลัก
      } else {
        alert("Login failed");
        console.log("รายละเอียด:", user);
      }
    } catch (err) {
      console.error("Login Error:", err);
      alert("เกิดข้อผิดพลาด");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">

      <div className="text-center max-w-md w-full p-6 bg-white rounded-xl shadow-md">

        <h2 className="text-2xl font-bold mb-6">Log In</h2>

        <form onSubmit={handleLogin} className="space-y-4">

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="StudentID@unifood.com"
            className="w-full p-3 border border-gray-300 rounded"
            required
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
          >
            Log In
          </button>

          <button
            onClick={goToHome}
            className="w-full bg-red-600 text-white font-semibold py-2 rounded hover:bg-red-700 transition"
          >
            Cancel
          </button>
          
          <div
            className="text-blue-600 cursor-pointer hover:underline transition text-center mt-4"
            onClick={goToSignup}>
              Sign Up
          </div>

        </form>
      </div>
    </div>
  );
}

export default LoginPage;
