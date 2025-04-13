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
            @RequestParam("description")String description,
            @RequestParam("location") String location,
            @RequestParam("image") MultipartFile imageFile
    ) {
        try {
            // ตั้งชื่อไฟล์สุ่ม
            String filename = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();
            Path imagePath = Paths.get("uploads/" + filename);

            // สร้างโฟลเดอร์ถ้ายังไม่มี
            Files.createDirectories(imagePath.getParent());

            // เซฟไฟล์รูป
            Files.write(imagePath, imageFile.getBytes());

            // สร้างและบันทึกข้อมูลร้าน
            Restaurants restaurant = new Restaurants();
            restaurant.setName(name);
            restaurant.setCategory(category);
            restaurant.setDescription(description);
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
    public ResponseEntity<?> updateRestaurant(
            @PathVariable String id,
            @RequestParam("name") String name,
            @RequestParam("category") String category,
            @RequestParam("description") String description,
            @RequestParam("location") String location,
            @RequestParam(value = "image", required = false) MultipartFile imageFile
    ) {
        try {
            Restaurants restaurant = restaurantRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("ไม่พบร้าน"));

            restaurant.setName(name);
            restaurant.setCategory(category);
            restaurant.setDescription(description);
            restaurant.setLocation(location);

            // ถ้ามีการอัปโหลดไฟล์ใหม่
            if (imageFile != null && !imageFile.isEmpty()) {
                String filename = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();
                Path imagePath = Paths.get("uploads/" + filename);
                Files.createDirectories(imagePath.getParent());
                Files.write(imagePath, imageFile.getBytes());

                restaurant.setImage("/uploads/" + filename); // อัปเดต path รูปใหม่
            }

            restaurantRepository.save(restaurant);
            return ResponseEntity.ok(restaurant);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("เกิดข้อผิดพลาดในการอัปเดตร้าน: " + e.getMessage());
        }
    }

    // ลบร้านอาหารตาม ID
    @DeleteMapping("/{id}")
    public void deleteRestaurant(@PathVariable String id) {
        restaurantRepository.deleteById(id);
    }

    @GetMapping("/search")
    public List<Restaurants> searchRestaurants(@RequestParam("query") String query) {
        return restaurantRepository.findByNameContainingIgnoreCaseOrCategoryContainingIgnoreCaseOrDescriptionContainingIgnoreCase(query, query, query);
    }

}
