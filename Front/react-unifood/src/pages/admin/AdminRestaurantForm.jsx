import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminRestaurantForm() {
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState({
    name: "",
    category: "",
    description: "",
    location: "",
  });

  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    setRestaurant({ ...restaurant, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", restaurant.name);
    data.append("category", restaurant.category);
    data.append("description", restaurant.description);
    data.append("location", restaurant.location);
    if (imageFile) {
      data.append("image", imageFile);
    }

    fetch("/api/restaurants", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then(() => {
        alert("เพิ่มร้านสำเร็จ!");
        setRestaurant({ name: "", category: "", description: "", location: "" });
        setImageFile(null);
        navigate("/");
      })
      .catch((err) => {
        console.error("❌ Error:", err);
        alert("เกิดข้อผิดพลาด");
      });
  };

  const handleClear = () => {
    if (!window.confirm("ยืนยันการล้างข้อมูล?")) return;
    setRestaurant({ name: "", category: "", description: "", location: "" });
    setImageFile(null);
  };

  const handleCancel = (e) => {
    if (!window.confirm("ยืนยันการยกเลิก? \nระบบจะพาคุณไปสู่หน้าหลัก")) return;
    e.preventDefault();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-100 via-orange-100 to-yellow-200 flex items-center justify-center px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 space-y-5"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold text-orange-600">🍜 เพิ่มร้านอาหาร</h1>
          <p className="text-gray-500 mt-1">กรอกข้อมูลร้านอาหารใหม่ด้านล่าง</p>
        </div>

        <input
          type="text"
          name="name"
          placeholder="ชื่อร้าน"
          value={restaurant.name}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
          required
        />

        <select
          name="category"
          value={restaurant.category}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
          required
        >
          <option value="">-- เลือกหมวดหมู่ --</option>
          <option value="Food">Food</option>
          <option value="Dessert">Dessert</option>
          <option value="Drink">Drink</option>
          <option value="Cafe">Cafe</option>
        </select>

        <input
          type="text"
          name="description"
          placeholder="รายละเอียดเพิ่มเติม"
          value={restaurant.description}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
          required
        />

        <input
          type="text"
          name="location"
          placeholder="ที่ตั้งร้าน เช่น อาคาร 25"
          value={restaurant.location}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full p-2 border border-gray-300 rounded-xl"
          required
        />

        {imageFile && (
          <img
            src={URL.createObjectURL(imageFile)}
            alt="Preview"
            className="w-full h-64 object-cover rounded-xl border mt-2"
          />
        )}

        <div className="flex flex-col space-y-3 pt-2">
          <button
            type="submit"
            className="bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition"
          >
            ✅ บันทึก
          </button>

          <button
            type="reset"
            onClick={handleClear}
            className="bg-gray-500 text-white py-3 rounded-xl hover:bg-gray-600 transition"
          >
            🧹 ล้างข้อมูล
          </button>

          <button
            type="button"
            onClick={handleCancel}
            className="bg-red-500 text-white py-3 rounded-xl hover:bg-red-600 transition"
          >
            ❌ ยกเลิก
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminRestaurantForm;
