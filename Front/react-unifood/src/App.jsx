import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

function App() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [restaurants, setRestaurants] = useState([]);

  const handleDelete = async (id) => {
    const confirm = window.confirm("คุณแน่ใจว่าต้องการลบร้านนี้?");
    if (!confirm) return;
  
    try {
      const res = await fetch(`/api/restaurants/${id}`, {
        method: "DELETE",
      });
  
      if (res.ok) {
        alert("ลบร้านเรียบร้อยแล้ว");
        setRestaurants(restaurants.filter((r) => r.id !== id));
      } else {
        alert("ลบไม่สำเร็จ");
      }
    } catch (err) {
      console.error("Delete Error:", err);
      alert("เกิดข้อผิดพลาดขณะลบ");
    }
  };  

  useEffect(() => {
    fetch("/api/restaurants")
      .then((res) => res.json())
      .then((data) => {
        console.log("📦 data from backend:", data);
        setRestaurants(data); 
      })
      .catch((err) => console.error("Error fetching:", err));
  }, []);

  return (
    <div className="px-4 py-6 max-w-7xl mx-auto">

      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-center">
        ร้านอาหารภายในมหาวิทยาลัย
      </h1>

      {user?.role === "admin" && (
      <div className="text-right mb-4">
        <Link to="/admin/add-restaurant">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            ➕ เพิ่มร้านอาหาร
          </button>
        </Link>
      </div>
)}

      {restaurants.length === 0 ? (
        <p className="text-center text-gray-500">ไม่มีข้อมูลร้านอาหาร</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {restaurants.map((r) => {
            console.log("🖼️ imageUrl for", r.name, ":", r.imageUrl);
            return (
              <div
                key={r.id}
                className="p-4 border rounded-xl shadow hover:shadow-lg transition duration-300 bg-white"
              >
                <h2 className="text-lg font-semibold mb-1">
                  <Link to={`/restaurant/${r.id}`} className="text-blue-600 hover:underline">
                    {r.name}
                  </Link>
                </h2>

                <p className="text-sm text-gray-600 mb-1">
                  {r.category} · {r.location}
                </p>
                <p className="text-sm mb-2">
                  ⭐ {r.averageRating} ({r.reviewsCount} รีวิว)
                </p>
                {r.imageUrl && (
                  <img 
                    src={r.imageUrl}
                    alt={r.name}
                    className="w-full h-[200px] object-cover"
                  />
                )}
                {user?.role === "admin" && (
                  <div className="flex gap-2 mt-2">
                    <Link to={`/admin/edit-restaurant/${r.id}`}>
                      <button className="text-sm bg-yellow-500 text-white px-2 py-1 rounded">📝 แก้ไข</button>
                    </Link>
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="text-sm bg-red-600 text-white px-2 py-1 rounded"
                    >
                      ❌ ลบ
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default App;
