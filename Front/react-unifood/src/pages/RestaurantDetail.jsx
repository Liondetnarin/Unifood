import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StarRating from "../components/StarRating";
import { Star } from "lucide-react";

function RestaurantDetail() {
  const { id } = useParams();
  const [showForm, setShowForm] = useState(false);
  const [restaurant, setRestaurant] = useState(null);
  const [reviews, setReviews] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const [editingReviewId, setEditingReviewId] = useState(null);

  const [newReview, setNewReview] = useState({
    tasteRating: 5,
    cleanlinessRating: 5,
    speedRating: 5,
    valueRating: 5,
    comment: "",
  });

  const [editReviewData, setEditReviewData] = useState({
    tasteRating: 5,
    cleanlinessRating: 5,
    speedRating: 5,
    valueRating: 5,
    comment: "",
  });

  const handleDeleteReview = async (reviewId) => {
    let confirmMessage = "คุณต้องการลบรีวิวนี้หรือไม่?";
    if (user?.role === "admin") {
      confirmMessage = "คุณกำลังลบรีวิวในฐานะผู้ดูแลระบบ (admin) — แน่ใจหรือไม่?";
    }

    const confirm = window.confirm(confirmMessage);
    if (!confirm) return;

    try {
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        alert("เกิดข้อผิดพลาดขณะลบ");
        return;
      }

      alert("ลบรีวิวเรียบร้อยแล้ว");

      const refreshed = await fetch(`/api/reviews/restaurant/${id}`);
      const data = await refreshed.json();
      setReviews(data);
    } catch (err) {
      console.error("ลบไม่สำเร็จ", err);
      alert("ลบไม่สำเร็จ");
    }
  };

  const handleChange = (e) => {
    setNewReview({ ...newReview, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditReviewData({ ...editReviewData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const reviewToSend = {
      ...newReview,
      restaurantId: id,
      userId: user?.id || "unknown",
      userName: user?.name || "ไม่ระบุชื่อ",
      createdAt: new Date().toISOString(),
      status: "approved",
    };

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewToSend),
      });

      const text = await res.text(); // อ่าน response ไม่ว่าจะเป็น error หรือสำเร็จ

      if (!res.ok) {
        alert(text); // ถ้าไม่ ok แสดง error จาก backend
        return;
      }

      alert("รีวิวสำเร็จ!");
      setNewReview({ tasteRating: 5, cleanlinessRating: 5, speedRating: 5, valueRating: 5, comment: "" });
      setShowForm(false);

      const refreshed = await fetch(`/api/reviews/restaurant/${id}`);
      const data = await refreshed.json();
      setReviews(data);
    } catch (err) {
      console.error("Review Submit Error:", err);
      alert("เกิดข้อผิดพลาดขณะส่งรีวิว");
    }
  };

  const handleUpdateReview = async (e, reviewId) => {
    e.preventDefault();
    try {
      await fetch(`/api/reviews/${reviewId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editReviewData),
      });

      alert("แก้ไขรีวิวเรียบร้อยแล้ว");
      setEditingReviewId(null);

      const res = await fetch(`/api/reviews/restaurant/${id}`);
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      console.error("แก้ไขไม่สำเร็จ", err);
    }
  };

  useEffect(() => {
    fetch(`/api/restaurants/${id}`)
      .then((res) => res.json())
      .then((data) => setRestaurant(data));

    fetch(`/api/reviews/restaurant/${id}`)
      .then((res) => res.json())
      .then((data) => setReviews(data));
  }, [id]);

  if (!restaurant) return <div className="p-6">กำลังโหลดข้อมูลร้าน...</div>;

  return (
    <div className="h-screen w-screen bg-gradient-to-b from-orange-400 to-orange-200 p-6 overflow-auto">
      <h1 className="text-2xl font-bold text-center" > {restaurant.name}</h1>
      <p className="text-gray-600" > {restaurant.category} · {restaurant.location}</p>
      
      {restaurant.image && (
        <img
          src={`http://localhost:8080${restaurant.image}`}
          alt={restaurant.name}
          className="w-full h-64 object-cover rounded-lg mt-4"
        />
      )}
      
      {restaurant.description && (
        <p className="mt-4 text-gray-700">{restaurant.description}</p>
      )}

      <button
        onClick={() => setShowForm(!showForm)
        }
        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
      >
        {showForm ? "ยกเลิกรีวิว" : "รีวิวร้านนี้"}
      </button >

      {
        showForm && (
          <form onSubmit={handleSubmit} className="space-y-2 border-t pt-4 mt-4">
            <h2 className="text-xl font-semibold">เขียนรีวิว</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="font-medium">คะแนนความอร่อย</p>
                <StarRating
                  rating={newReview.tasteRating}
                  onChange={(val) => setNewReview({ ...newReview, tasteRating: val })}
                />
              </div>

              <div>
                <p className="font-medium">คะแนนความสะอาด</p>
                <StarRating
                  rating={newReview.cleanlinessRating}
                  onChange={(val) => setNewReview({ ...newReview, cleanlinessRating: val })}
                />
              </div>

              <div>
                <p className="font-medium">คะแนนความรวดเร็ว</p>
                <StarRating
                  rating={newReview.speedRating}
                  onChange={(val) => setNewReview({ ...newReview, speedRating: val })}
                />
              </div>

              <div>
                <p className="font-medium">คะแนนความคุ้มค่า</p>
                <StarRating
                  rating={newReview.valueRating}
                  onChange={(val) => setNewReview({ ...newReview, valueRating: val })}
                />
              </div>
            </div>

            <textarea name="comment" value={newReview.comment} onChange={handleChange} className="w-full p-2 border rounded" placeholder="เขียนความคิดเห็น..." />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">ส่งรีวิว</button>
          </form>
        )
      }

      <div className="h-screen mt-6 border-t pt-4">
        <h3 className="text-lg font-semibold mb-2">รีวิวทั้งหมด</h3>
        {reviews.length === 0 ? (
          <p className="text-gray-500">ยังไม่มีรีวิว</p>
        ) : (
          <ul className="space-y-4">
            {reviews.map((rev) => (
              <li key={rev.id} className="border p-3 rounded bg-white">
                {editingReviewId === rev.id ? (
                  <form onSubmit={(e) => handleUpdateReview(e, rev.id)} className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <input type="number" name="tasteRating" value={editReviewData.tasteRating} onChange={handleEditChange} min="1" max="5" className="p-2 border rounded" />
                      <input type="number" name="cleanlinessRating" value={editReviewData.cleanlinessRating} onChange={handleEditChange} min="1" max="5" className="p-2 border rounded" />
                      <input type="number" name="speedRating" value={editReviewData.speedRating} onChange={handleEditChange} min="1" max="5" className="p-2 border rounded" />
                      <input type="number" name="valueRating" value={editReviewData.valueRating} onChange={handleEditChange} min="1" max="5" className="p-2 border rounded" />
                    </div>
                    <textarea name="comment" value={editReviewData.comment} onChange={handleEditChange} className="w-full p-2 border rounded" />
                    <div className="flex gap-2">
                      <button type="submit" className="bg-green-600 text-white px-4 py-1 rounded">บันทึก</button>
                      <button type="button" className="bg-gray-500 text-white px-4 py-1 rounded" onClick={() => setEditingReviewId(null)}>ยกเลิก</button>
                    </div>
                  </form>
                ) : (
                  <>
                    <p className="text-sm font-medium text-blue-700">รีวิวโดย: {rev.userName || "ไม่ระบุชื่อ"}</p>
                    <p>⭐ อร่อย: {rev.tasteRating}, สะอาด: {rev.cleanlinessRating}, เร็ว: {rev.speedRating}, คุ้ม: {rev.valueRating}</p>
                    <p className="italic text-gray-700 mt-1">"{rev.comment}"</p>
                    {user && (rev.userId === user.id || user.role === "admin") && (
                      <div className="text-right text-sm">
                        {/*  เฉพาะเจ้าของรีวิวเท่านั้นที่แก้ได้ */}
                        {rev.userId === user.id && (
                          <button
                            className="text-blue-600 hover:underline mr-2"
                            onClick={() => {
                              setEditingReviewId(rev.id);
                              setEditReviewData({
                                tasteRating: rev.tasteRating,
                                cleanlinessRating: rev.cleanlinessRating,
                                speedRating: rev.speedRating,
                                valueRating: rev.valueRating,
                                comment: rev.comment
                              });
                            }}
                          >
                            แก้ไข
                          </button>
                        )}

                        {/* ทั้งเจ้าของรีวิว และ admin ลบได้ */}
                        <button
                          onClick={() => handleDeleteReview(rev.id)}
                          className="text-red-600 hover:underline">ลบรีวิวนี้</button>
                      </div>
                    )}

                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div >
  );
}

export default RestaurantDetail;
