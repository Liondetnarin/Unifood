import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StarRating from "../components/StarRating";
import { FaStar } from 'react-icons/fa';
import { Star } from "lucide-react";
import ReadOnlyStars from "../components/ReadOnlyStars";

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
    <div className="min-h-screen w-full bg-gradient-to-b from-yellow-100 to-yellow-100 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-6">
        <h1 className="text-3xl font-bold text-center text-yellow-600">{restaurant.name}</h1>
        <p className="text-gray-600 text-center mb-4">{restaurant.category} · Location {restaurant.location}</p>

        {restaurant.image && (
          <img
            src={`http://localhost:8080${restaurant.image}`}
            alt={restaurant.name}
            className="w-full h-72 object-cover rounded-xl shadow-md"
          />
        )}
        
        <div className="flex items-center space-x-2 mt-1">

          <span className="flex items-center bg-red-800 text-white text-sm font-bold px-2 py-0.5 rounded-lg">
            {restaurant.averageRating.toFixed(1)} <FaStar className="text-white w-3 h-3 ml-1" />
          </span>

          <span className="text-gray-500 text-sm"> ({restaurant.reviewsCount} รีวิว) </span>
        </div>
        
        {restaurant.description && (
          <p className="mt-4 text-gray-800 leading-relaxed">{restaurant.description}</p>
        )}

        <div className="flex justify-left mt-6 ">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-xl font-medium shadow-md transition"
          >
            {showForm ? "ยกเลิกรีวิว" : "รีวิวร้านนี้"}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4 border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-700">เขียนรีวิว</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: "คะแนนความอร่อย", key: "tasteRating" },
                { label: "คะแนนความสะอาด", key: "cleanlinessRating" },
                { label: "คะแนนความรวดเร็ว", key: "speedRating" },
                { label: "คะแนนความคุ้มค่า", key: "valueRating" },
              ].map(({ label, key }) => (
                <div key={key}>
                  <p className="font-medium text-gray-600">{label}</p>
                  <StarRating
                    rating={newReview[key]}
                    onChange={(val) => setNewReview({ ...newReview, [key]: val })}
                  />
                </div>
              ))}
            </div>
            <textarea
              name="comment"
              value={newReview.comment}
              onChange={handleChange}
              placeholder="เขียนความคิดเห็น..."
              className="w-full p-3 border border-gray-300 rounded-xl shadow-sm"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl shadow-md"
            >
              ส่งรีวิว
            </button>
          </form>
        )}

        <div className="mt-10 border-t pt-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">รีวิวทั้งหมด</h3>
          {reviews.length === 0 ? (
            <p className="text-gray-500">ยังไม่มีรีวิว</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="bg-yellow-50 p-4 rounded-xl shadow-sm">
                  <p className="text-sm font-medium text-yellow-600 mb-1">รีวิวโดย: {rev.userName || "ไม่ระบุชื่อ"}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 text-sm gap-2 text-gray-800 mb-2">
                    <div className="flex items-center gap-1"><span>อร่อย:</span><ReadOnlyStars value={rev.tasteRating} /></div>
                    <div className="flex items-center gap-1"><span>สะอาด:</span><ReadOnlyStars value={rev.cleanlinessRating} /></div>
                    <div className="flex items-center gap-1"><span>รวดเร็ว:</span><ReadOnlyStars value={rev.speedRating} /></div>
                    <div className="flex items-center gap-1"><span>คุ้มค่า:</span><ReadOnlyStars value={rev.valueRating} /></div>
                  </div>
                  {editingReviewId === rev.id ? (
                    <form onSubmit={(e) => handleUpdateReview(e, rev.id)} className="space-y-2">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                        {[
                          { key: "tasteRating", label: "อร่อย" },
                          { key: "cleanlinessRating", label: "สะอาด" },
                          { key: "speedRating", label: "รวดเร็ว" },
                          { key: "valueRating", label: "คุ้มค่า" }
                        ].map(({ key, label }) => (
                          <div key={key}>
                            <p className="text-xs text-gray-600">{label}</p>
                            <StarRating
                              rating={editReviewData[key]}
                              onChange={(val) =>
                                setEditReviewData({ ...editReviewData, [key]: val })
                              }
                            />
                          </div>
                        ))}
                      </div>
                      <textarea
                        name="comment"
                        value={editReviewData.comment}
                        onChange={handleEditChange}
                        className="w-full border p-2 rounded-md text-sm"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingReviewId(null)}
                          className="text-gray-500 text-sm hover:underline"
                        >
                          ยกเลิก
                        </button>
                        <button
                          type="submit"
                          className="text-blue-600 text-sm hover:underline"
                        >
                          บันทึก
                        </button>
                      </div>
                    </form>
                  ) : (
                    <p className="italic text-gray-700 mb-2">"{rev.comment}"</p>
                  )}

                  {user && (rev.userId === user.id || user.role === "admin") && (
                    <div className="text-right text-sm">
                      {rev.userId === user.id && (
                        <button
                          className="text-blue-600 hover:underline mr-3"
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
                      <button
                        onClick={() => handleDeleteReview(rev.id)}
                        className="text-red-600 hover:underline"
                      >
                        ลบรีวิวนี้
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>

  );
}

export default RestaurantDetail;
