import { useState } from "react";

function AdminRestaurantForm() {
  const [restaurant, setRestaurant] = useState({
    name: "",
    category: "",
    location: "",
    imageUrl: "",
  });

  const handleChange = (e) => {
    setRestaurant({ ...restaurant, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("/api/restaurants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(restaurant),
    })
      .then((res) => res.json())
      .then(() => {
        alert("เพิ่มร้านสำเร็จ!");
        setRestaurant({ name: "", category: "", location: "", imageUrl: "" });
      })
      .catch((err) => {
        console.error("❌ Error:", err);
        alert("เกิดข้อผิดพลาด");
      });
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">เพิ่มร้านอาหารใหม่</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="ชื่อร้าน"
          value={restaurant.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="category"
          placeholder="หมวดหมู่ (เช่น อาหารตามสั่ง)"
          value={restaurant.category}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="location"
          placeholder="ที่ตั้ง (เช่น อาคาร 25)"
          value={restaurant.location}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="imageUrl"
          placeholder="ลิงก์รูปภาพ (Google Drive / imgbb ฯลฯ)"
          value={restaurant.imageUrl}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          บันทึก
        </button>
      </form>
    </div>
  );
}

export default AdminRestaurantForm;
