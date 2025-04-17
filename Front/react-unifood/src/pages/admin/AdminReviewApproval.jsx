import { useEffect, useState } from "react";

function AdminReviewApproval() {
  const [reviews, setReviews] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.role !== "admin") {
    return (
      <div className="p-10 text-center text-red-600 font-semibold text-xl">
        ❌ คุณไม่มีสิทธิ์เข้าถึงหน้านี้
      </div>
    );
  }

  const fetchPendingReviews = () => {
    fetch("/api/reviews", {
      headers: {
        role: user?.role || "",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const pending = data.filter((rev) => rev.status !== "approved");
        setReviews(pending);
      });
  };

  useEffect(() => {
    fetchPendingReviews();
  }, []);

  const handleApprove = async (id) => {
    const res = await fetch(`/api/reviews/admin/approve/${id}`, {
      method: "PUT",
    });

    if (res.ok) {
      alert("✅ อนุมัติเรียบร้อยแล้ว");
      fetchPendingReviews();
    } else {
      alert("❌ อนุมัติไม่สำเร็จ");
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("ต้องการลบรีวิวนี้หรือไม่?");
    if (!confirm) return;

    const res = await fetch(`/api/reviews/admin/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      alert("🗑️ ลบเรียบร้อยแล้ว");
      fetchPendingReviews();
    } else {
      alert("❌ ลบไม่สำเร็จ");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-orange-50 via-yellow-50 to-pink-100 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-orange-600 mb-8">
          📝 รีวิวที่รออนุมัติ
        </h2>

        {reviews.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">
            ✨ ไม่มีรีวิวที่รออนุมัติในขณะนี้
          </p>
        ) : (
          <ul className="space-y-6">
            {reviews.map((rev) => (
              <li
                key={rev.id}
                className="bg-white shadow-md rounded-xl p-5 border-l-4 border-orange-400"
              >
                <div className="mb-2 flex justify-between items-center">
                  <p className="text-lg font-semibold text-orange-600">
                    👤 {rev.userName || "ไม่ระบุชื่อ"}
                  </p>
                  <span className="text-sm text-gray-400">
                    สถานะ: {rev.status}
                  </span>
                </div>

                <p className="text-gray-700 mb-2">
                  ⭐ อร่อย: {rev.tasteRating} | สะอาด: {rev.cleanlinessRating} |
                  เร็ว: {rev.speedRating} | คุ้มค่า: {rev.valueRating}
                </p>

                <p className="italic text-gray-800 bg-orange-50 p-3 rounded-md">
                  “{rev.comment}”
                </p>

                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    onClick={() => handleApprove(rev.id)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                  >
                    ✅ อนุมัติ
                  </button>
                  <button
                    onClick={() => handleDelete(rev.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                  >
                    🗑️ ลบ
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default AdminReviewApproval;
