import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

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
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("userId", user.id);
        localStorage.setItem("role", user.role);
        localStorage.setItem("email", user.email);

        alert(" Login completed!");
        setIsLoggedIn(true);
        navigate("/");
      } else {
        alert(" Login failed");
        console.log("รายละเอียด:", user);
      }
    } catch (err) {
      console.error("Login Error:", err);
      alert("เกิดข้อผิดพลาด");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    alert(" Logged out");
    navigate("/login");
  };

  const goToSignup = () => navigate("/register");
  const goToHome = () => navigate("/");

  return (
    <div className="flex items-center justify-center min-h-screen bg-yellow-50">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-yellow-600 mb-6">
          {isLoggedIn ? "ยินดีต้อนรับกลับ " : "เข้าสู่ระบบ UniFood "}
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          {!isLoggedIn && (
            <>
              <div>
                <label className="block text-left text-gray-700 mb-1">อีเมล</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="StudentID@unifood.com"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-yellow-400"
                  required
                />
              </div>

              <div>
                <label className="block text-left text-gray-700 mb-1">รหัสผ่าน</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-yellow-400"
                  required
                />
              </div>
            </>
          )}

          <button
            type={isLoggedIn ? "button" : "submit"}
            onClick={isLoggedIn ? handleLogout : undefined}
            className={`w-full ${isLoggedIn ? "bg-red-500 hover:bg-red-600" : "bg-yellow-500 hover:bg-yellow-600"
              } text-white font-semibold py-2 rounded transition`}
          >
            {isLoggedIn ? "ออกจากระบบ" : "เข้าสู่ระบบ"}
          </button>

          <button
            onClick={goToHome}
            type="button"
            className="w-full bg-gray-300 text-gray-800 font-semibold py-2 rounded hover:bg-gray-400 transition"
          >
            ยกเลิก
          </button>

          {!isLoggedIn && (
            <div className="text-center">
              <span className="text-gray-700">ยังไม่มีบัญชีใช่ไหม? </span>
              <button
                onClick={goToSignup}
                className="text-yellow-500 font-semibold hover:underline"
              >
                สมัครสมาชิก
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
