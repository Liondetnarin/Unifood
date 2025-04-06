import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function AdminEditRestaurant() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState({
    name: "",
    category: "",
    location: "",
    image: "",
  });

  // ใช้เก็บไฟล์รูปภาพ
  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    setRestaurant({ ...restaurant, [e.target.name]: e.target.value });
  };

  // โหลดข้อมูลร้านเดิม
  useEffect(() => {

    fetch(`/api/restaurants/${id}`)
      .then((res) => res.json())
      .then((data) => setRestaurant(data))
      .catch((err) => console.error("โหลดร้านล้มเหลว:", err));
  }, [id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file); // ไฟล์ใหม่
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", restaurant.name);
    formData.append("category", restaurant.category);
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

  // ฟังก์ชันสำหรับล้างข้อมูลในฟอร์ม
  const handleClear = () => {
    if (!window.confirm("ยืนยันการล้างข้อมูล?")) return;
    setRestaurant({ name: "", category: "", location: "" });
  };

  const handleCancel = (e) => {
    if (!window.confirm("ยืนยันการยกเลิก? \nระบบจะพาคุณไปสู่หน้าหลัก")) return;
    e.preventDefault();
    navigate("/"); // กลับไปยังหน้าหลักหรือหน้าที่ต้องการ
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 md:px-10 bg-gray-200">
      
      <form onSubmit={handleSubmit} className="space-y-4 p-4 rounded shadow-md w-full max-w-md bg-white">

      <h2 className="text-2xl font-bold text-center">แก้ไขร้านอาหาร</h2>
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
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full p-2 border rounded"
        />

        {/* Preview */}
        {imageFile ? (
          <img
            src={URL.createObjectURL(imageFile)}
            alt="Preview"
            className="w-full h-[250px] object-cover rounded-xl"
          />
        ) : (
          restaurant.image && (
            <img
              srcSet={`http://localhost:8080${restaurant.image}`}
              alt="รูปเดิม"
              className="w-full h-[250px] object-cover rounded-xl"
            />
          )
        )}
        
        <div className="flex justify-end space-x-2 mb-4">
          <button
            type="reset"
            onClick={handleClear}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            ล้างข้อมูล
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          บันทึกการแก้ไข
        </button>

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

export default AdminEditRestaurant;
