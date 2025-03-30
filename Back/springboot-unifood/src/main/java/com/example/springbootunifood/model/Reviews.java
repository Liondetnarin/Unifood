package com.example.springbootunifood.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "reviews")
public class Reviews {

    @Id
    private String id;

    private String restaurantId;        // เชื่อมกับร้าน
    private String userId;              // เชื่อมผู้ใช้

    private int tasteRating;            // ความอร่อย
    private int cleanlinessRating;      // ความสะอาด
    private int speedRating;            // ความรวดเร็ว
    private int valueRating;            // ความคุ้มค่า

    private String comment;             // ข้อความรีวิว
    private LocalDateTime createdAt;    // เวลาที่โพสต์
    private String status;              // approved / rejected (เผื่อใช้คัดกรองคำหยาบ)
}
