import { useState } from "react";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isRegistered, setIsRegistered] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();

        // ตรวจสอบว่า รหัสผ่านและยืนยันรหัสผ่านตรงกันไหม
        if (password !== confirmPassword) {
            alert("รหัสผ่านไม่ตรงกัน");
            return;
        }

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const user = await res.json();

            if (res.ok) {
                alert(" การสมัครสมาชิกเสร็จสมบูรณ์!");
                setIsRegistered(true);
                navigate("/login"); // พาไปที่หน้าล็อกอิน
            } else {
                alert(" การสมัครสมาชิกล้มเหลว");
                console.log("รายละเอียด:", user);
            }
        } catch (err) {
            console.error("Register Error:", err);
            alert("เกิดข้อผิดพลาด");
        }
    };

    const goToLogin = () => navigate("/login");
    const goToHome = () => navigate("/");

    return (
        <div className="flex items-center justify-center min-h-screen bg-yellow-50">
            <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
                <h2 className="text-3xl font-bold text-center text-yellow-600 mb-6">
                    {isRegistered ? "ยินดีต้อนรับสู่ UniFood " : "สมัครสมาชิก UniFood "}
                </h2>

                <form onSubmit={handleRegister} className="space-y-4">
                    {!isRegistered && (
                        <>
                            <div>
                                <label className="block text-left text-gray-700 mb-1">ชื่อ</label>
                                <input
                                    type="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="YourName"
                                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-yellow-400"
                                    required
                                />
                            </div>
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

                            <div>
                                <label className="block text-left text-gray-700 mb-1">ยืนยันรหัสผ่าน</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="********"
                                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-yellow-400"
                                    required
                                />
                            </div>
                        </>
                    )}

                    <button
                        type={isRegistered ? "button" : "submit"}
                        className={`w-full ${isRegistered ? "bg-green-500 hover:bg-green-600" : "bg-yellow-500 hover:bg-yellow-600"
                            } text-white font-semibold py-2 rounded transition`}
                    >
                        {isRegistered ? "กลับไปที่หน้าเข้าสู่ระบบ" : "สมัครสมาชิก"}
                    </button>

                    <button
                        onClick={goToHome}
                        type="button"
                        className="w-full bg-gray-300 text-gray-800 font-semibold py-2 rounded hover:bg-gray-400 transition"
                    >
                        ยกเลิก
                    </button>

                    {!isRegistered && (
                        <div className="text-center">
                            <span className="text-gray-700">มีบัญชีอยู่แล้ว? </span>
                            <button
                                onClick={goToLogin}
                                className="text-yellow-500 font-semibold hover:underline"
                            >
                                เข้าสู่ระบบ
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}

export default RegisterPage;
