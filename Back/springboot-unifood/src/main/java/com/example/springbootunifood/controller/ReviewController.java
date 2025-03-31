package com.example.springbootunifood.controller;

import com.example.springbootunifood.model.Reviews;
import com.example.springbootunifood.repository.ReviewRepository;
import com.example.springbootunifood.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    @Autowired
    private UserRepository userRepository;

    private final ReviewRepository reviewRepository;

    public ReviewController(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    // ดูรีวิวทั้งหมดของร้านอาหาร
    @GetMapping("/restaurant/{restaurantId}")
    public List<Reviews> getReviewsByRestaurant(@PathVariable String restaurantId) {
        return reviewRepository.findByRestaurantId(restaurantId);
    }

    // เพิ่มรีวิวใหม่
    @PostMapping
    public Reviews createReview(@RequestBody Reviews review) {
        review.setCreatedAt(LocalDateTime.now());
        review.setStatus("approved");

        // ดึงชื่อจาก user แล้วใส่ลงใน review
        userRepository.findById(review.getUserId()).ifPresent(user -> {
            review.setUserName(user.getName());  // << สำคัญ!
        });

        return reviewRepository.save(review);
    }

    // ลบรีวิวตาม ID
    @DeleteMapping("/{id}")
    public void deleteReview(@PathVariable String id) {
        reviewRepository.deleteById(id);
    }
}
