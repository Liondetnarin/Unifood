import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
    
          alert("เข้าสู่ระบบสำเร็จ!");
          navigate("/"); // กลับหน้าหลัก
        } else {
          alert("เข้าสู่ระบบล้มเหลว");
          console.log("รายละเอียด:", user);
        }
      } catch (err) {
        console.error("Login Error:", err);
        alert("เกิดข้อผิดพลาด");
      }
    };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">เข้าสู่ระบบ</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="อีเมล"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="รหัสผ่าน"
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          เข้าสู่ระบบ
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
