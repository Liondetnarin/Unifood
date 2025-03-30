package com.example.springbootunifood.controller;

import com.example.springbootunifood.model.Reviews;
import com.example.springbootunifood.repository.ReviewRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

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
        review.setStatus("approved");   // default (ระบบยังไม่มีกรองคำหยาบ)
        return reviewRepository.save(review);
    }

    // ลบรีวิวตาม ID
    @DeleteMapping("/{id}")
    public void deleteReview(@PathVariable String id) {
        reviewRepository.deleteById(id);
    }
}
