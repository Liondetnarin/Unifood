import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminRestaurantForm() {
  const navigate = useNavigate(); // ใช้ useNavigate เพื่อเปลี่ยนเส้นทางหลังจากส่งข้อมูล

  const [restaurant, setRestaurant] = useState({
    name: "",
    category: "",
    location: "",
    imageUrl: "",
  });

  // ฟังก์ชันสำหรับจัดการการเปลี่ยนแปลงข้อมูลในฟอร์ม
  const handleChange = (e) => {
    setRestaurant({ ...restaurant, [e.target.name]: e.target.value });
  };

  // ฟังก์ชันสำหรับส่งข้อมูลร้านอาหารไปยัง API
  // ใช้ fetch API เพื่อส่งข้อมูลไปยังเซิร์ฟเวอร์
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
        // navigate("/admin/restaurants"); // เปลี่ยนเส้นทางไปยังหน้ารายการร้านอาหารหลังจากเพิ่มสำเร็จ
        navigate("/"); // เปลี่ยนเส้นทางไปยังหน้ารายการร้านอาหารหลังจากเพิ่มสำเร็จ
      })
      .catch((err) => {
        console.error("❌ Error:", err);
        alert("เกิดข้อผิดพลาด");
      });
  };

  // ฟังก์ชันสำหรับล้างข้อมูลในฟอร์ม
  const handleClear = () => {
    setRestaurant({ name: "", category: "", location: "", imageUrl: "" });
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
          type="text"
          name="imageUrl"
          placeholder="ลิงก์รูปภาพ"
          value={restaurant.imageUrl}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

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
