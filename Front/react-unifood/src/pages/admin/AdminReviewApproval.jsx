import { useEffect, useState } from "react";

function AdminReviewApproval() {
    const [reviews, setReviews] = useState([]);
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || user.role !== "admin") {
        return <div className="p-6 text-center text-red-600">คุณไม่มีสิทธิ์เข้าถึงหน้านี้</div>;
      }

    const fetchPendingReviews = () => {
    
        fetch("/api/reviews", {
            headers: {
                role: user?.role || ""
            }
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
      alert("อนุมัติเรียบร้อยแล้ว");
      fetchPendingReviews();
    } else {
      alert("อนุมัติไม่สำเร็จ");
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("ต้องการลบรีวิวนี้หรือไม่?");
    if (!confirm) return;

    const res = await fetch(`/api/reviews/admin/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      alert("ลบเรียบร้อยแล้ว");
      fetchPendingReviews();
    } else {
      alert("ลบไม่สำเร็จ");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">รีวิวที่รออนุมัติ</h2>
      {reviews.length === 0 ? (
        <p className="text-gray-500">ไม่มีรีวิวที่รออนุมัติ</p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((rev) => (
            <li key={rev.id} className="border p-3 rounded bg-white">
              <p className="text-sm font-medium text-blue-700">รีวิวโดย: {rev.userName || "ไม่ระบุชื่อ"}</p>
              <p>⭐ อร่อย: {rev.tasteRating}, สะอาด: {rev.cleanlinessRating}, เร็ว: {rev.speedRating}, คุ้ม: {rev.valueRating}</p>
              <p className="italic text-gray-700 mt-1">"{rev.comment}"</p>
              <div className="text-right space-x-2 mt-2">
                <button onClick={() => handleApprove(rev.id)} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">อนุมัติ</button>
                <button onClick={() => handleDelete(rev.id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">ลบ</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AdminReviewApproval;
