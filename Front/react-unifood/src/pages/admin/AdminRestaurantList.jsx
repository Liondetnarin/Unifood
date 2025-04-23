import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function AdminRestaurantList() {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    fetch("/api/restaurants")
      .then((res) => res.json())
      .then((data) => setRestaurants(data))
      .catch((err) => console.error("โหลดร้านล้มเหลว:", err));
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm("ยืนยันการลบร้านนี้?")) return;

    fetch(`/api/restaurants/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        alert("ลบร้านเรียบร้อยแล้ว");
        setRestaurants(restaurants.filter((r) => r.id !== id));
      })
      .catch((err) => console.error("ลบไม่สำเร็จ:", err));
  };

  return (
    <div className="bg-gradient-to-b from-yellow-100 to-yellow-100 min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        <nav className="flex justify-between mb-6">
          <Link to="/" className="text-yellow-700 font-semibold hover:underline">
            กลับหน้าหลัก
          </Link>
          <Link
            to="/admin/add-restaurant"
            className="bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700"
          >
            เพิ่มร้านอาหาร
          </Link>
        </nav>

        <h2 className="text-2xl font-bold text-yellow-700 mb-4 text-center">รายการร้านอาหารทั้งหมด</h2>

        {restaurants.length === 0 ? (
          <p className="text-center text-gray-600">ยังไม่มีร้านอาหารในระบบ</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {restaurants.map((r) => (
              <div
                key={r.id}
                className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{r.name}</h3>
                  <p className="text-gray-600 mb-4">หมวดหมู่: {r.category}</p>
                  {r.image && (
                    <img
                      src={`http://localhost:8080${r.image}`}
                      alt={r.name}
                      className="w-full h-[250px] object-cover rounded-lg mb-4"
                    />
                  )}
                </div>

                <div className="flex justify-end space-x-3">
                  <Link
                    to={`/admin/edit-restaurant/${r.id}`}
                    className="bg-yellow-400 text-white px-4 py-1 rounded-xl hover:bg-yellow-500 transition"
                  >
                    แก้ไข
                  </Link>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="bg-red-500 text-white px-4 py-1 rounded-xl hover:bg-red-600 transition"
                  >
                    ลบ
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminRestaurantList;
