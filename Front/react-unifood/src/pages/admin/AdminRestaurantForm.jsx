import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminRestaurantForm() {
  const navigate = useNavigate(); // ใช้ useNavigate เพื่อเปลี่ยนเส้นทางหลังจากส่งข้อมูล

  const [restaurant, setRestaurant] = useState({
    name: "",
    category: "",
    location: "",
  });

  // ใช้เก็บไฟล์รูปภาพ
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
    data.append("location", restaurant.location);
    if (imageFile) {
      data.append("image", imageFile); // แนบไฟล์รูปภาพ
    }

    fetch("/api/restaurants", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then(() => {

        alert("เพิ่มร้านสำเร็จ!");
        setRestaurant({ name: "", category: "", location: "" });
        setImageFile(null);

        navigate("/"); // เปลี่ยนเส้นทางไปยังหน้ารายการร้านอาหารหลังจากเพิ่มสำเร็จ
      })

      .catch((err) => {
        console.error("❌ Error:", err);
        alert("เกิดข้อผิดพลาด");

      });
  };

  // ฟังก์ชันสำหรับล้างข้อมูลในฟอร์ม
  const handleClear = () => {
    setRestaurant({ name: "", category: "", location: "" });
  };

  const handleCancel = (e) => {
    e.preventDefault();
    navigate("/"); // กลับไปยังหน้าหลักหรือหน้าที่ต้องการ
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 md:px-10">
      <form onSubmit={handleSubmit} className="space-y-4 p-4 rounded shadow-md w-full max-w-md bg-white">

        <h1 className="text-2xl font-bold text-center">เพิ่มร้านอาหาร</h1>
        <p className="text-gray-600 text-center">กรุณากรอกข้อมูลร้านอาหาร</p>
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
          required
        />

        {/* <select
          name="category"
          value={restaurant.category}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">-- Select a category --</option>
          <option value="Food">Food</option>
          <option value="Dessert">Dessert</option>
          <option value="Drink">Drink</option>
          <option value="Cafe">Cafe</option>
        </select> */}

        <input
          type="text"
          name="location"
          placeholder="ที่ตั้ง (เช่น อาคาร 25)"
          value={restaurant.location}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full p-2 border rounded"
          required
        />

        {imageFile && (
          <img
            src={URL.createObjectURL(imageFile)}
            alt="Preview"
            className="w-full h-[250px] object-cover rounded-xl"
          />
        )}

        <div className="flex justify-between mt-4">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            บันทึก
          </button>

          <button
            type="reset"
            onClick={handleClear}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            ล้างข้อมูล
          </button>
        </div>

        <button
          type="button"
          onClick={handleCancel}
          className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          ยกเลิก
        </button>
      </form>
    </div>

  );
}

export default AdminRestaurantForm;
