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
    <div className="bg-gray-200 min-h-screen flex items-center justify-center">
    <div className="max-w-5xl mx-auto p-6">
      <nav className="mb-4">
        <Link to="/" className="text-red-600 hover:underline mr-4 hover:text-red-500">
          หน้าหลัก
        </Link>
        <Link to="/admin/add-restaurant" className="text-blue-600 hover:underline">
          เพิ่มร้านอาหาร
        </Link>
      </nav>
      <h2 className="text-xl font-bold mb-4">รายการร้านอาหาร</h2>

      {restaurants.length === 0 ? (
        <p>ไม่มีร้านอาหาร</p>
      ) : (
        <table className="w-full table-auto border rounded-lg shadow-md bg-white">
          <thead className="bg-white">
            <tr>
              <th className="border p-2">ชื่อร้าน</th>
              <th className="border p-2">หมวดหมู่</th>
              <th className="border p-2">การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {restaurants.map((r) => (
              <tr key={r.id}>
                <td className="border p-2">{r.name}</td>
                <td className="border p-2">{r.category}</td>
                <td className="border p-2 text-right">
                  
                  <Link
                    to={`/admin/edit-restaurant/${r.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    แก้ไข
                  </Link>

                  <button
                    onClick={() => handleDelete(r.id)}
                    className="text-red-600 hover:underline"
                  >
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    </div>
  );
}

export default AdminRestaurantList;
