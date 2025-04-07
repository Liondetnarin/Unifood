// components/StarRating.jsx
import { useState } from "react";
import { Star } from "lucide-react"; // ใช้ไอคอนจาก lucide-react (หรือจะใช้ emoji ก็ได้)

function StarRating({ rating, onChange }) {
  const [hovered, setHovered] = useState(null); // สำหรับ hover effect

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((val) => (
        <Star
          key={val}
          size={24}
          onMouseEnter={() => setHovered(val)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => onChange(val)}
          className={`cursor-pointer transition ${
            (hovered || rating) >= val ? "text-yellow-400" : "text-gray-300"
          }`}
          fill={(hovered || rating) >= val ? "currentColor" : "none"}
        />
      ))}
    </div>
  );
}

export default StarRating;
