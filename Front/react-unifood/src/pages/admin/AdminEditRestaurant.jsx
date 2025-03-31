import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function AdminEditRestaurant() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState({
    name: "",
    category: "",
    location: "",
    imageUrl: "",
  });

  // โหลดข้อมูลร้านเดิม
  useEffect(() => {
    fetch(`/api/restaurants/${id}`)
      .then((res) => res.json())
      .then((data) => setRestaurant(data))
      .catch((err) => console.error("โหลดร้านล้มเหลว:", err));
  }, [id]);

  const handleChange = (e) => {
    setRestaurant({ ...restaurant, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`/api/restaurants/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(restaurant),
    })
      .then(() => {
        alert("แก้ไขร้านเรียบร้อยแล้ว");
        navigate("/admin/restaurants");
      })
      .catch((err) => console.error("แก้ไขไม่สำเร็จ:", err));
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">แก้ไขร้านอาหาร</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={restaurant.name}
          onChange={handleChange}
          placeholder="ชื่อร้าน"
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="category"
          value={restaurant.category}
          onChange={handleChange}
          placeholder="หมวดหมู่"
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="location"
          value={restaurant.location}
          onChange={handleChange}
          placeholder="ที่ตั้ง"
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="imageUrl"
          value={restaurant.imageUrl}
          onChange={handleChange}
          placeholder="ลิงก์รูป"
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          บันทึกการแก้ไข
        </button>
      </form>
    </div>
  );
}

export default AdminEditRestaurant;
