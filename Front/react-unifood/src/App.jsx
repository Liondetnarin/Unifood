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
    <div className="h-screen px-4 py-8 max-w-7xl mx-auto bg-gradient-to-b from-orange-400 via-orange-250 to-orange-100">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
        ร้านอาหารภายในมหาลัย
      </h1>

      <div className="text-center mb-4 mx-auto space-x-2 flex justify-center gap-4">
        <div className="flex flex-col items-center">
          <button className="bg-orange-200 px-4 py-2 rounded hover:bg-orange-100 flex items-center justify-center">
            ➕
          </button>
          <p className="text-sm text-gray-700 mt-2">Recommand</p>
        </div>

        <div className="flex flex-col items-center">
          <button className="bg-orange-200 px-4 py-2 rounded hover:bg-orange-100 flex items-center justify-center">
            ➕
          </button>
          <p className="text-sm text-gray-700 mt-2">Food</p>
        </div>

        <div className="flex flex-col items-center">
          <button className="bg-orange-200 px-4 py-2 rounded hover:bg-orange-100 flex items-center justify-center">
            ➕
          </button>
          <p className="text-sm text-gray-700 mt-2">Dessert</p>
        </div>

        <div className="flex flex-col items-center">
          <button className="bg-orange-200 px-4 py-2 rounded hover:bg-orange-100 flex items-center justify-center">
            ➕
          </button>
          <p className="text-sm text-gray-700 mt-2">Drink</p>
        </div>

        <div className="flex flex-col items-center">
          <button className="bg-orange-200 px-4 py-2 rounded hover:bg-orange-100 flex items-center justify-center">
            ➕
          </button>
          <p className="text-sm text-gray-700 mt-2">Coffee</p>
        </div>
      </div>

      <p className="text-xl text-white-100 mt-2 h-[30px] font-bold">Recommeand For You</p>
      <div className="sm:grid-cols-2 lg:grid-cols-3 flex gap-2">
        {restaurants.map((r) => {
          console.log("🖼️ imageUrl for", r.name, ":", r.imageUrl);
          return (
            <div key={r.id} className="p-6 border border-gray-300 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 bg-white">
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
                  className="w-full h-[250px] object-cover rounded-lg mb-4"
                />
              )}
            </div>
          );
        })}
      </div>

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

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ">
          <p className="text-xl mt-2 h-[15px] text-center font-bold">Food</p>
          {restaurants.map((r) => {
            console.log("🖼️ imageUrl for", r.name, ":", r.imageUrl);
            return (
              <div key={r.id} className="p-6 border border-gray-300 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 bg-white">
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
                    className="w-full h-[250px] object-cover rounded-lg mb-4"
                  />
                )}
                {user?.role === "admin" && (
                  <div className="flex gap-2 mt-2">
                    <Link to={`/admin/edit-restaurant/${r.id}`}>
                      <button className="text-sm bg-yellow-500 text-white px-4 py-2 rounded-lg shadow hover:bg-yellow-600 transition-all duration-200">
                        📝 แก้ไข</button>
                    </Link>
                    <button onClick={() => handleDelete(r.id)} className="text-sm bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700 transition-all duration-200">
                      ❌ ลบ
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          <p className="text-xl text-white-100 mt-2 h-[30px] font-bold text-center">Dessert</p>
          <div className="sm:grid-cols-2 lg:grid-cols-3 flex gap-2">
            {restaurants.map((r) => {
              console.log("🖼️ imageUrl for", r.name, ":", r.imageUrl);
              return (
                <div key={r.id} className="p-6 border border-gray-300 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 bg-white">
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
                      className="w-full h-[250px] object-cover rounded-lg mb-4"
                    />
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-xl text-white-100 mt-2 h-[30px] font-bold text-center">Drink</p>
          <div className="sm:grid-cols-2 lg:grid-cols-3 flex gap-2">
            {restaurants.map((r) => {
              console.log("🖼️ imageUrl for", r.name, ":", r.imageUrl);
              return (
                <div key={r.id} className="p-6 border border-gray-300 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 bg-white">
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
                      className="w-full h-[250px] object-cover rounded-lg mb-4"
                    />
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-xl text-white-100 mt-2 h-[30px] font-bold text-center">Coffee</p>
          <div className="sm:grid-cols-2 lg:grid-cols-3 flex gap-2">
            {restaurants.map((r) => {
              console.log("🖼️ imageUrl for", r.name, ":", r.imageUrl);
              return (
                <div key={r.id} className="p-6 border border-gray-300 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 bg-white">
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
                      className="w-full h-[250px] object-cover rounded-lg mb-4"
                    />
                  )}
                </div>
              );
            })}
          </div>

        </div>
      )}
    </div>
  );
}

export default App;
