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
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">รายการร้านอาหาร</h2>

      {restaurants.length === 0 ? (
        <p>ไม่มีร้านอาหาร</p>
      ) : (
        <table className="w-full table-auto border">
          <thead className="bg-gray-100">
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
                <td className="border p-2 space-x-2">
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
  );
}

export default AdminRestaurantList;
