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
  const [searchText, setSearchText] = useState(""); // สร้าง state สำหรับการค้นหา

  // สร้าง state สำหรับการค้นหา
  const handleSearch = (e) => {
    e.preventDefault();

    // ✅ ป้องกันการส่ง query ว่าง (เช่น กดค้นหาโดยไม่พิมพ์)
    if (!searchText.trim()) {
      alert("กรุณากรอกคำค้นหา");
      return;
    }

    fetch(`http://localhost:8080/api/restaurants/search?keyword=${encodeURIComponent(searchText)}`)
      .then((res) => {
        if (!res.ok) throw new Error("เกิดข้อผิดพลาดในการค้นหา");
        return res.json();
      })
      .then((data) => {
        console.log("🔍 ผลลัพธ์ที่ค้นหา:", data);
        setRestaurants(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("❌ ค้นหาไม่สำเร็จ:", err);
        setRestaurants([]); // ป้องกัน .sort() error
      });
  };


  // ฟังก์ชันสำหรับแสดงหมวดหมู่ร้านอาหารใน Swiper
  const renderSwiperSection = (category, displayName) => {
    const filtered = restaurants.filter((r) => r.category === category);
    const count = filtered.length;

    if (filtered.length === 0) {
      return (
        <div className="max-w-6xl mx-auto">
          <p id={category.toLowerCase()} className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6">
            {displayName}
          </p>
          <p className="text-center text-gray-500 mb-8">
            ไม่มีข้อมูลร้านอาหารในหมวด {displayName}
          </p>
        </div>
      );
    }

    return (

      <div className="max-w-6xl mx-auto">
        <p id={category.toLowerCase()} className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8">{displayName}</p>

        <div className="mb-6">
          {count >= 1 ? (
            <Swiper
              modules={[Navigation]}
              spaceBetween={20}
              navigation
              className=""
              centeredSlides={filtered.length === 1}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
            >
              {filtered.map((r) => (
                <SwiperSlide key={r.id}>
                  <div
                    onClick={() => navigate(`/restaurant/${r.id}`)}
                    className="mx-auto cursor-pointer p-6 border border-gray-300 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 bg-white mb-8"
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

  // ฟังก์ชันสำหรับเพิ่มร้านอาหาร
  const AdminButtons_Add = (id) => {
    if (!isAdmin) return null;

    return (
      <div
        onClick={() => navigate("/admin/add-restaurant")}
        className="flex justify-center">

        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700">
          เพิ่มร้านอาหาร
        </button>
      </div>
    )
  };

  // ฟังก์ชันสำหรับดูรีวิวที่รออนุมัติ
  const AdminButtons_Riview = (id) => {
    if (!isAdmin) return null;

    return (
      <div
        onClick={() => navigate("/admin/reviews")}
        className="flex justify-center">

        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700">
          รีวิวที่รออนุมัติ
        </button>
      </div>
    )
  };

  // ฟังก์ชันสำหรับดูรีวิวที่รออนุมัติ
  const AdminButtons_RestaurantList = (id) => {
    if (!isAdmin) return null;

    return (
      <div
        onClick={() => navigate("/admin/restaurants ")}
        className="flex justify-center">

        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700">
          รายการร้านอาหาร
        </button>
      </div>
    )
  };

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

    <div className="min-h-screen w-full bg-gray-200 p-6">

      <div>
        <nav className="bg-yellow-400 shadow-md p-4 mb-6 rounded-lg">

          <div className="flex justify-between items-center max-w-8xl mx-auto">

            <div className="flex space-x-4 items-center">

              <Link to="/">
                <span className="text-4xl font-bold text-blue-700">Uni</span>
                <span className="text-4xl font-bold text-red-600">Food</span>
              </Link>

            </div>

            <div className="flex items-center space-x-4">

              <form onSubmit={handleSearch} className="flex items-center space-x-2">

                <input
                  type="text"
                  placeholder="กินอะไรดี..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="px-40 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />

                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-bold">
                  ค้นหา
                </button>

              </form>

            </div>

            <div className="flex gap-4 justify-center items-center flex-wrap">

              {isAdmin && AdminButtons_Riview()}

              {isAdmin && AdminButtons_RestaurantList()}

              <Link to="/login">
                <button className="text-gray-700 hover:text-blue-600">Log in</button>
              </Link>

              <Link to="/register">
                <button className="text-gray-700 hover:text-blue-600">Sign up</button>
              </Link>

            </div>

          </div>
        </nav>
      </div>

      <div className="max-w-6xl mx-auto mb-8">

        <div className="flex gap-4 mb-4 justify-center items-center flex-wrap">

          {["Food", "Dessert", "Drink", "Cafe"].map((category) => (
            <button key={category} className="bg-yellow-400 text-white px-4 py-2 rounded-lg shadow-md hover:bg-yellow-500"

              onClick={() => {
                const section = document.getElementById(category.toLowerCase());
                if (section) {
                  section.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >{category}
            </button>

          ))}

          {isAdmin && AdminButtons_Add()}

        </div>
      </div>

      {restaurants.length === 0 ? (

        <p className="text-center text-gray-500">ไม่มีข้อมูลร้านอาหาร</p>
      ) : (

        <div className="max-w-6xl mx-auto">

          <h2 id="Recommend For You" className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6">Recommend For You</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

            {restaurants
              .sort(() => Math.random() - 0.5) // สุ่มเรียงลำดับ
              .slice(0, 4) // เลือกมาแค่ 4 รายการ
              .map((r) => (

                <div
                  key={r.id}
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

        </div>

      )}


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
                  <p className="text-sm text-gray-600">{r.category} · {r.location}</p>
                  <p className="text-sm mb-1">⭐ {r.averageRating} ({r.reviewsCount} รีวิว)</p>

                  {renderAdminButtons_FixAndDelete(r.id)}

                </div>
              ))}
          </div>

          <div className="flex justify-center mt-6 mb-6">

            {restaurants.filter((r) => r.category === "Food").length > 4 && (

              <div className="flex justify-center items-center gap-4">

                {visibleCount < restaurants.filter((r) => r.category === "Food").length ? (

                  <button
                    onClick={() => setVisibleCount((prev) => prev + 4)} // เพิ่มทีละ 4
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    แสดงเพิ่มเติม
                  </button>

                ) : (

                  <button
                    onClick={() => setVisibleCount(4)} // ซ่อนกลับเหลือ 4
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