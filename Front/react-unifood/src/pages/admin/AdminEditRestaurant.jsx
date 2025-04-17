import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function AdminEditRestaurant() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState({
    name: "",
    category: "",
    description: "",
    location: "",
    image: "",
  });

  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    setRestaurant({ ...restaurant, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    fetch(`/api/restaurants/${id}`)
      .then((res) => res.json())
      .then((data) => setRestaurant(data))
      .catch((err) => console.error("โหลดร้านล้มเหลว:", err));
  }, [id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", restaurant.name);
    formData.append("category", restaurant.category);
    formData.append("description", restaurant.description);
    formData.append("location", restaurant.location);

    if (imageFile) {
      formData.append("image", imageFile);
    } else {
      formData.append("image", restaurant.image);
    }

    fetch(`/api/restaurants/${id}`, {
      method: "PUT",
      body: formData,
    })
      .then(() => {
        alert("แก้ไขร้านเรียบร้อยแล้ว");
        navigate("/admin/restaurants");
      })
      .catch((err) => console.error("แก้ไขไม่สำเร็จ:", err));
  };

  const handleClear = () => {
    if (!window.confirm("ยืนยันการล้างข้อมูล?")) return;
    setRestaurant({
      name: "",
      category: "",
      description: "",
      location: "",
      image: "",
    });
    setImageFile(null);
  };

  const handleCancel = (e) => {
    if (!window.confirm("ยืนยันการยกเลิก? \nระบบจะพาคุณไปสู่หน้าหลัก")) return;
    e.preventDefault();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-100 via-orange-100 to-yellow-100 flex items-center justify-center py-10 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 space-y-5"
      >
        <h2 className="text-3xl font-bold text-center text-orange-600 mb-4">
          ✏ แก้ไขข้อมูลร้านอาหาร
        </h2>

        <input
          name="name"
          value={restaurant.name}
          onChange={handleChange}
          placeholder="ชื่อร้าน"
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
          name="location"
          value={restaurant.location}
          onChange={handleChange}
          placeholder="ที่ตั้งร้าน"
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full p-2 border border-gray-300 rounded-xl"
        />

        {/* รูป Preview */}
        {imageFile ? (
          <img
            src={URL.createObjectURL(imageFile)}
            alt="รูปใหม่"
            className="w-full h-64 object-cover rounded-xl border"
          />
        ) : (
          restaurant.image && (
            <img
              srcSet={`http://localhost:8080${restaurant.image}`}
              alt="รูปเดิม"
              className="w-full h-64 object-cover rounded-xl border"
            />
          )
        )}

        {/* ปุ่มต่าง ๆ */}
        <div className="flex flex-col space-y-3 pt-2">
          <button
            type="submit"
            className="bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition"
          >
            ✅ บันทึกการแก้ไข
          </button>

          <button
            type="button"
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

export default AdminEditRestaurant;
