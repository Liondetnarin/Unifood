import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

function App() {

  // ดึงข้อมูลร้านอาหารจาก API
  useEffect(() => {
    fetch("/api/restaurants")
      .then((res) => res.json())
      .then((data) => {
        console.log("📦 data from backend:", data);
        setRestaurants(data);
      })
      .catch((err) => console.error("Error fetching:", err));
  }, []);

  const navigate = useNavigate(); // ใช้ useNavigate เพื่อเปลี่ยนเส้นทาง
  const user = JSON.parse(localStorage.getItem("user")); // ดึงข้อมูลผู้ใช้จาก localStorage
  const isAdmin = user?.role === "admin"; // ตรวจสอบว่าผู้ใช้เป็น admin หรือไม่
  const [restaurants, setRestaurants] = useState([]); // สร้าง state สำหรับร้านอาหาร
  const [visibleCount, setVisibleCount] = useState(4); // เริ่มแสดง 4 ร้านอาหาร

  // ฟังก์ชันสำหรับแสดงหมวดหมู่ร้านอาหารใน Swiper
  const renderSwiperSection = (category, displayName) => {
    const filtered = restaurants.filter((r) => r.category === category);
    const count = filtered.length;
    if (count === 0) return null;
  
    return (
      <div className="max-w-6xl mx-auto">
        <p id={category.toLowerCase()} className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6">{displayName}</p>
  
        <div className="mb-6">
          {count >= 3 ? (
            <Swiper
              modules={[Navigation]}
              spaceBetween={20}
              navigation
              className="pb-8"
              breakpoints={{
                640: { slidesPerView: 1 },
                740: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
            >
              {filtered.map((r) => (
                <SwiperSlide>
                  <div
                  key={r.id}
                  onClick={() => navigate(`/restaurant/${r.id}`)}
                  className="cursor-pointer p-6 border border-gray-300 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 bg-white"
                  >
                    {r.image && (
                      <img
                        src={`http://localhost:8080${r.image}`}
                        alt={r.name}
                        className="w-full h-[250px] object-cover rounded-lg mb-4"
                      />
                    )}
                    <h2 className="text-lg font-semibold mb-1">{r.name}</h2>
                    <p className="text-sm text-gray-600 mb-1">{r.category} · {r.location}</p>
                    <p className="text-sm mb-2">⭐ {r.averageRating} ({r.reviewsCount} รีวิว)</p>
                    {renderAdminButtons_FixAndDelete(r.id)}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="flex justify-center gap-4 flex-wrap">
              {filtered.map((r) => (
                <div
                  key={r.id}
                  onClick={() => navigate(`/restaurant/${r.id}`)}
                  className="w-[300px] cursor-pointer p-6 border border-gray-300 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 bg-white"
                >
                  {r.image && (
                    <img
                      src={`http://localhost:8080${r.image}`}
                      alt={r.name}
                      className="w-full h-[250px] object-cover rounded-lg mb-4"
                    />
                  )}
                  <h2 className="text-lg font-semibold mb-1">{r.name}</h2>
                  <p className="text-sm text-gray-600 mb-1">{r.category} · {r.location}</p>
                  <p className="text-sm mb-2">⭐ {r.averageRating} ({r.reviewsCount} รีวิว)</p>
                  {renderAdminButtons_FixAndDelete(r.id)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // เฉพาะผู้ดูแลระบบ
  // ฟังก์ชันสำหรับแสดงปุ่มแก้ไขและลบร้านอาหาร
  const renderAdminButtons_FixAndDelete = (id) => {
    if (!isAdmin) return null;
  
    return (
      <div className="flex gap-2 mt-4">
        <button
          onClick={(e) => {
            e.stopPropagation(); // หยุดการทำงานของเหตุการณ์คลิกที่เกิดขึ้นใน div หลัก
            navigate(`/admin/edit-restaurant/${id}`);
          }}
          className="bg-yellow-400 text-white px-3 py-1 rounded-lg hover:bg-yellow-500 transition"
        >
          📝 แก้ไข
        </button>
  
        <button
          onClick={(e) => {
            e.stopPropagation(); // หยุดการทำงานของเหตุการณ์คลิกที่เกิดขึ้นใน div หลัก
            handleDelete(id);
          }}
          className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
        >
          ❌ ลบ
        </button>
      </div>
    );
  };

  // ฟังก์ชันสำหรับแสดงเพิ่มร้านอาหาร
  const renderAdminButtons_Add = (id) => {
    if (!isAdmin) return null;
  
    return (
    <div
    onClick={() => navigate("/admin/add-restaurant")}
    className="flex justify-center">
      
      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700">
        เพิ่มร้านอาหาร
      </button>
    </div>
  )};

  // ฟังก์ชันสำหรับลบร้านอาหาร
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

        <div className="flex gap-4 mb-4 justify-center items-center flex-wrap">

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

          {isAdmin && renderAdminButtons_Add()}
        
        </div>
      </div>

      <h2 id="Recommend For You" className="text-2xl font-semibold text-gray-700 mb-6">Recommend For You</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

        {restaurants
          .sort(() => Math.random() - 0.5) // สุ่มเรียงลำดับ
          .slice(0, 4) // เลือกมาแค่ 4 รายการ
          .map((r) => (
          
          <div
            onClick={() => navigate(`/restaurant/${r.id}`)}
            className="cursor-pointer p-6 border border-gray-300 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 bg-white"
          >
            {r.image && (
              <img
                src={`http://localhost:8080${r.image}`}
                alt={r.name}
                className="w-full h-[250px] object-cover rounded-xl mb-4"
              />
            )}

            <h2 className="text-lg font-semibold mb-1">{r.name}</h2>
            <p className="text-sm text-gray-600 mb-1">{r.category} · {r.location}</p>
            <p className="text-sm mb-2">⭐ {r.averageRating} ({r.reviewsCount} รีวิว)</p>

            {renderAdminButtons_FixAndDelete(r.id)}
          </div>

          ))}
      </div>

      {restaurants.length === 0 ? (

        <p className="text-center text-gray-500">ไม่มีข้อมูลร้านอาหาร</p>
      ) : (

        <div className="max-w-6xl mx-auto">

          <p id="food" className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6">Food</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

            {restaurants
              .filter((r) => r.category === "Food") //กรองเฉพาะหมวด food
              .slice(0, visibleCount) //แสดงจำนวนที่กำหนด
              .map((r) => (

                <div key={r.id} className="p-5 bg-white border rounded-xl shadow-lg hover:shadow-2xl transition duration-300">

                  <h2 className="text-lg font-semibold mb-1">
                    
                  </h2>

                  <p className="text-sm text-gray-600">{r.category} · {r.location}</p>

                  <p className="text-sm mb-1">⭐ {r.averageRating} ({r.reviewsCount} รีวิว)</p>

                  {r.image && (
                    <img
                      src={`http://localhost:8080${r.image}`}
                      alt={r.name}
                      className="w-full h-[250px] object-cover rounded-lg mb-4"
                    />
                  )}
                  
                  {renderAdminButtons_FixAndDelete(r.id)}
                  
                </div>
              ))}
          </div>
          
          <div className="flex justify-center mt-4 mb-6">
            
            {restaurants.filter((r) => r.category === "Food").length > 3 && (

              <div className="mt-6 text-center">
                
                {visibleCount < restaurants.filter((r) => r.category === "Food").length ? (

                  <button
                    onClick={() => setVisibleCount((prev) => prev + 3)} // เพิ่มทีละ 3
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    แสดงเพิ่มเติม
                  </button>

                ) : (

                  <button
                    onClick={() => setVisibleCount(4)} // ซ่อนกลับเหลือ 3
                    className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
                  >
                    ซ่อน
                  </button>

                )}
              </div>
            )}

          </div>

          {renderSwiperSection("Dessert", "Dessert")}

          {renderSwiperSection("Drink", "Drink")}

          {renderSwiperSection("Cafe", "Cafe")}

        </div>

      )}

    </div>
  );
}

export default App;