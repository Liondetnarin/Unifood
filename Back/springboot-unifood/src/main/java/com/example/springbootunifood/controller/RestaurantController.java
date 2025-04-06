package com.example.springbootunifood.controller;

import com.example.springbootunifood.model.Restaurants;
import com.example.springbootunifood.repository.RestaurantRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/restaurants")
@CrossOrigin(origins = "*") // อนุญาตให้ frontend React เข้าถึง
public class RestaurantController {

    private final RestaurantRepository restaurantRepository;

    public RestaurantController(RestaurantRepository restaurantRepository) {
        this.restaurantRepository = restaurantRepository;
    }

    // ดึงร้านอาหารทั้งหมด
    @GetMapping
    public List<Restaurants> getAllRestaurants() {
        return restaurantRepository.findAll();
    }

    // ดึงร้านอาหารเดี่ยวตาม ID
    @GetMapping("/{id}")
    public Restaurants getRestaurantById(@PathVariable String id) {
        return restaurantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ไม่พบร้านที่ต้องการ"));
    }

    // เพิ่มร้านอาหารใหม่
    @PostMapping
    public ResponseEntity<?> createRestaurant(
            @RequestParam("name") String name,
            @RequestParam("category") String category,
            @RequestParam("location") String location,
            @RequestParam("image") MultipartFile imageFile
    ) {
        try {
            // ✅ ตั้งชื่อไฟล์สุ่ม
            String filename = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();
            Path imagePath = Paths.get("uploads/" + filename);

            // ✅ สร้างโฟลเดอร์ถ้ายังไม่มี
            Files.createDirectories(imagePath.getParent());

            // ✅ เซฟไฟล์รูป
            Files.write(imagePath, imageFile.getBytes());

            // ✅ สร้างและบันทึกข้อมูลร้าน
            Restaurants restaurant = new Restaurants();
            restaurant.setName(name);
            restaurant.setCategory(category);
            restaurant.setLocation(location);
            restaurant.setImage("/uploads/" + filename); // เก็บ path
            restaurant.setAverageRating(0.0);
            restaurant.setReviewsCount(0);

            restaurantRepository.save(restaurant);

            return ResponseEntity.ok(restaurant);

        } catch (IOException e) {
            return ResponseEntity.status(500).body("อัปโหลดรูปภาพไม่สำเร็จ: " + e.getMessage());
        }
    }

    // แก้ไขร้านอาหาร
    @PutMapping("/{id}")
    public Restaurants updateRestaurant(@PathVariable String id, @RequestBody Restaurants updated) {
        updated.setId(id);
        return restaurantRepository.save(updated);
    }

    // ลบร้านอาหารตาม ID
    @DeleteMapping("/{id}")
    public void deleteRestaurant(@PathVariable String id) {
        restaurantRepository.deleteById(id);
    }
}
