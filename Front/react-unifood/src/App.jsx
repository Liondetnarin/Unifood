import { useEffect, useState } from "react";
import { Link } from 'react-router-dom'

function App() {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    fetch("/api/restaurants")
      .then((res) => res.json())
      .then((data) => setRestaurants(data))
      .catch((err) => console.error("Error fetching:", err));
  }, []);

  return (
    <div className="px-4 py-6 max-w-7xl mx-auto">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-center">
        ร้านอาหารภายในมหาวิทยาลัย
      </h1>

      {restaurants.length === 0 ? (
        <p className="text-center text-gray-500">ไม่มีข้อมูลร้านอาหาร</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {restaurants.map((r) => (
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
                  className="w-full h-40 object-cover rounded-lg"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
