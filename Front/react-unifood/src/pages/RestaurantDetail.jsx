import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function RestaurantDetail() {
  const { id } = useParams();
  const [showForm, setShowForm] = useState(false);
  const [restaurant, setRestaurant] = useState(null);
  const [reviews, setReviews] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  
  const [newReview, setNewReview] = useState({
    
    tasteRating: 5,
    cleanlinessRating: 5,
    speedRating: 5,
    valueRating: 5,
    comment: "",
  });

  const reviewToSend = {
    ...newReview,
    restaurantId: id,
    userId: user?.id || "test-user",
    userName: user?.name || "ไม่ระบุชื่อ",
    createdAt: new Date().toISOString(),
    status: "approved",
  };  

  // โหลดข้อมูลร้าน
  useEffect(() => {
    fetch(`/api/restaurants/${id}`)
      .then((res) => res.json())
      .then((data) => setRestaurant(data));

    fetch(`/api/reviews/restaurant/${id}`)
      .then((res) => res.json())
      .then((data) => setReviews(data));
  }, [id]);

  const handleChange = (e) => {
    setNewReview({ ...newReview, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const reviewToSend = {
      ...newReview,
      restaurantId: id,
      userId: user?.id || "unknown",
      createdAt: new Date().toISOString(),
      status: "approved",
    };

    fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reviewToSend),
    })
      .then((res) => res.json())
      .then(() => {
        alert("รีวิวสำเร็จ!");
        setNewReview({ tasteRating: 5, cleanlinessRating: 5, speedRating: 5, valueRating: 5, comment: "" });
         setShowForm(false);
        return fetch(`/api/reviews/restaurant/${id}`);
      })
      .then((res) => res.json())
      .then((data) => setReviews(data));
  };

  if (!restaurant) return <div className="p-6">กำลังโหลดข้อมูลร้าน...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">{restaurant.name}</h1>
      <p className="text-gray-600">{restaurant.category} · {restaurant.location}</p>
      {restaurant.imageUrl && <img src={restaurant.imageUrl} alt={restaurant.name} className="w-full rounded-lg" />}

      <button onClick={() => setShowForm(!showForm)}
        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
          {showForm ? "ยกเลิกรีวิว" : "รีวิวร้านนี้"}
      </button>

      {/* ฟอร์มรีวิว */}
      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-2 border-t pt-4 mt-4">
          <h2 className="text-xl font-semibold">เขียนรีวิว</h2>
          <div className="grid grid-cols-2 gap-2">
            <input type="number" name="tasteRating" value={newReview.tasteRating} onChange={handleChange} min="1" max="5" className="p-2 border rounded" placeholder="ความอร่อย (1-5)" />
            <input type="number" name="cleanlinessRating" value={newReview.cleanlinessRating} onChange={handleChange} min="1" max="5" className="p-2 border rounded" placeholder="ความสะอาด (1-5)" />
            <input type="number" name="speedRating" value={newReview.speedRating} onChange={handleChange} min="1" max="5" className="p-2 border rounded" placeholder="ความเร็ว (1-5)" />
            <input type="number" name="valueRating" value={newReview.valueRating} onChange={handleChange} min="1" max="5" className="p-2 border rounded" placeholder="ความคุ้มค่า (1-5)" />
          </div>
          <textarea name="comment" value={newReview.comment} onChange={handleChange} className="w-full p-2 border rounded" placeholder="เขียนความคิดเห็น..." />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">ส่งรีวิว</button>
        </form>
)}

      {/* รีวิวทั้งหมด */}
      <div className="mt-6 border-t pt-4">
        <h3 className="text-lg font-semibold mb-2">รีวิวทั้งหมด</h3>
        {reviews.length === 0 ? (
          <p className="text-gray-500">ยังไม่มีรีวิว</p>
        ) : (
          <ul className="space-y-4">
            {reviews.map((rev) => (
              <li key={rev.id} className="border p-3 rounded bg-white">
                <p className="text-sm text-gray-600 font-semibold">
                  รีวิวโดย: {rev.userName || "ไม่ระบุชื่อ"}
                </p>
                <p>
                  ⭐ อร่อย: {rev.tasteRating}, สะอาด: {rev.cleanlinessRating}, เร็ว: {rev.speedRating}, คุ้ม: {rev.valueRating}
                </p>
                <p className="italic text-gray-700 mt-1">"{rev.comment}"</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default RestaurantDetail;
