import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

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

    <div className="min-h-screen w-full bg-gradient-to-b from-orange-400 to-orange-200 p-6">

      <div className="flex items-center mb-6 mx-auto space-x-2">
        <Link to="/login">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Login
          </button>
        </Link>

        <Link to="/admin/reviews">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            admin/review
          </button>
        </Link>

        <Link to="/admin/restaurants">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            admin/restaurants
          </button>
        </Link>

        <Link to="/admin/edit-restaurant/:id">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            admin/edit-restaurant/:id
          </button>
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        UniFood
      </h1>

      <div className="text-center mb-4 mx-auto space-x-2 flex justify-center gap-4">
        
        <div className="flex flex-wrap justify-center gap-3 mb-6">

          {["Recommend", "Food", "Dessert", "Drink", "Coffee"].map((category) => (
            <button key={category} className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-orange-600"

              onClick={() => {
                const section = document.getElementById(category.toLowerCase());
                if (section) {
                  section.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >{category}
              
            </button>
              
          ))}

          {user?.role === "admin" && (
            <div className="text-right mb-4">
              <Link to="/admin/add-restaurant">
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  เพิ่มร้านอาหาร
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>

      <h2 id="Recommend For You" className="text-2xl font-semibold text-gray-700 mb-4">Recommend For You</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {restaurants
          .sort(() => Math.random() - 0.5) // สุ่มเรียงลำดับ
          .slice(0, 4) // เลือกมาแค่ 4 รายการ
          .map((r) => (
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
          ))}
      </div>


      {restaurants.length === 0 ? (

        <p className="text-center text-gray-500">ไม่มีข้อมูลร้านอาหาร</p>
      ) : (

        <div className="lg:grid-cols-3">
          <p id="food" className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4">Food</p>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {restaurants.map((r) => (
              <div key={r.id} className="p-5 bg-white border rounded-xl shadow-lg hover:shadow-2xl transition duration-300">
                <h2 className="text-lg font-semibold mb-1">
                  <Link to={`/restaurant/${r.id}`} className="text-lg font-semibold text-blue-600 hover:underline">
                    {r.name}
                  </Link>
                </h2>
                <p className="text-sm text-gray-600">{r.category} · {r.location}</p>
                <p className="text-sm mb-1">⭐ {r.averageRating} ({r.reviewsCount} รีวิว)</p>
                {r.imageUrl && (
                  <img src={r.imageUrl} alt={r.name} className="w-full h-[200px] object-cover rounded-lg mb-3" />
                )}
                {user?.role === "admin" && (
                  <div className="flex gap-2 mt-4">
                    <Link to={`/admin/edit-restaurant/${r.id}`}>
                      <button className="bg-yellow-400 text-white px-3 py-1 rounded-lg hover:bg-yellow-500 transition">
                        📝 แก้ไข
                      </button>
                    </Link>
                    <button onClick={() => handleDelete(r.id)} className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition">
                      ❌ ลบ
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="max-w-6xl mx-auto">
            <p id="dessert" className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6">Dessert</p>
            <Swiper
              modules={[Navigation]}
              spaceBetween={20} //ระยะห่างระหว่างแต่ละรายการ
              slidesPerView={1} //จำนวนรายการที่แสดง (ค่าเริ่มต้น)
              navigation //ปุ่มลูกศร
              breakpoints={{
                640: { slidesPerView: 2 }, // หน้าจอเล็ก แสดง 2 รายการ
                1024: { slidesPerView: 3 }, // หน้าจอใหญ่ แสดง 3 รายการ
              }}
              className="pb-8"
            >
              {restaurants.map((r) => (
                <SwiperSlide key={r.id}>
                  <div className="p-6 border border-gray-300 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 bg-white">
                    <h2 className="text-lg font-semibold mb-1">
                      <Link to={`/restaurant/${r.id}`} className="text-blue-600 hover:underline">
                        {r.name}
                      </Link>
                    </h2>
                    <p className="text-sm text-gray-600 mb-1">{r.category} · {r.location}</p>
                    <p className="text-sm mb-2">⭐ {r.averageRating} ({r.reviewsCount} รีวิว)</p>
                    {r.imageUrl && (
                      <img src={r.imageUrl} alt={r.name} className="w-full h-[250px] object-cover rounded-lg mb-4" />
                    )}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="max-w-6xl mx-auto">
            <p id="drink" className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6">Drink</p>
            <Swiper
              modules={[Navigation]}
              spaceBetween={20}
              slidesPerView={1}
              navigation
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="pb-8"
            >
              {restaurants.map((r) => (
                <SwiperSlide key={r.id}>
                  <div className="p-6 border border-gray-300 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 bg-white">
                    <h2 className="text-lg font-semibold mb-1">
                      <Link to={`/restaurant/${r.id}`} className="text-blue-600 hover:underline">
                        {r.name}
                      </Link>
                    </h2>
                    <p className="text-sm text-gray-600 mb-1">{r.category} · {r.location}</p>
                    <p className="text-sm mb-2">⭐ {r.averageRating} ({r.reviewsCount} รีวิว)</p>
                    {r.imageUrl && (
                      <img src={r.imageUrl} alt={r.name} className="w-full h-[250px] object-cover rounded-lg mb-4" />
                    )}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="max-w-6xl mx-auto">
            <p id="coffee" className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6">Coffee</p>
            <Swiper
              modules={[Navigation]}
              spaceBetween={20}
              slidesPerView={1}
              navigation
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="pb-8"
            >
              {restaurants.map((r) => (
                <SwiperSlide key={r.id}>
                  <div className="p-6 border border-gray-300 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 bg-white">
                    <h2 className="text-lg font-semibold mb-1">
                      <Link to={`/restaurant/${r.id}`} className="text-blue-600 hover:underline">
                        {r.name}
                      </Link>
                    </h2>
                    <p className="text-sm text-gray-600 mb-1">{r.category} · {r.location}</p>
                    <p className="text-sm mb-2">⭐ {r.averageRating} ({r.reviewsCount} รีวิว)</p>
                    {r.imageUrl && (
                      <img src={r.imageUrl} alt={r.name} className="w-full h-[250px] object-cover rounded-lg mb-4" />
                    )}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

        </div>
      )}
    </div>
  );
}

export default App;
