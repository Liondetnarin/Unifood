package com.example.springbootunifood.controller;

import com.example.springbootunifood.ProfanityFilterUtil;
import com.example.springbootunifood.model.Reviews;
import com.example.springbootunifood.repository.ReviewRepository;
import com.example.springbootunifood.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

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
    public List<Reviews> getApprovedReviews(@PathVariable String restaurantId) {
        return reviewRepository.findByRestaurantIdAndStatus(restaurantId, "approved");
    }

    // ดึงรีวิวทั้งหมด (เฉพาะแอดมิน)
    @GetMapping
    public ResponseEntity<?> getAllReviews(@RequestHeader(value = "role", required = false) String role) {
        if (!"admin".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }
        return ResponseEntity.ok(reviewRepository.findAll());
    }

    // เพิ่มรีวิวใหม่
    @PostMapping
    public ResponseEntity<?> createReview(@RequestBody Reviews review) {
        review.setCreatedAt(LocalDateTime.now());

        // ตรวจสอบคำหยาบ
        if (ProfanityFilterUtil.containsProfanity(review.getComment())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("พบคำไม่สุภาพ กรุณาแก้ไขก่อนส่งรีวิว");
        }

        review.setStatus("pending");

        userRepository.findById(review.getUserId()).ifPresent(user -> {
            review.setUserName(user.getName());
        });

        return ResponseEntity.ok(reviewRepository.save(review));
    }

    // ลบรีวิวตาม ID
    @DeleteMapping("/{id}")
    public void deleteReview(@PathVariable String id) {
        reviewRepository.deleteById(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateReview(@PathVariable String id, @RequestBody Reviews updatedReview) {
        return reviewRepository.findById(id).map(existing -> {
            existing.setTasteRating(updatedReview.getTasteRating());
            existing.setCleanlinessRating(updatedReview.getCleanlinessRating());
            existing.setSpeedRating(updatedReview.getSpeedRating());
            existing.setValueRating(updatedReview.getValueRating());
            existing.setComment(updatedReview.getComment());
            existing.setCreatedAt(LocalDateTime.now());

            return ResponseEntity.ok(reviewRepository.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/admin/approve/{id}")
    public ResponseEntity<?> approveReview(@PathVariable String id) {
        Optional<Reviews> reviewOpt = reviewRepository.findById(id);
        if (reviewOpt.isPresent()) {
            Reviews review = reviewOpt.get();
            review.setStatus("approved");
            return ResponseEntity.ok(reviewRepository.save(review));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("ไม่พบรีวิวนี้");
        }
    }

    @DeleteMapping("/admin/{id}")
    public ResponseEntity<?> deleteReviewByAdmin(@PathVariable String id) {
        if (!reviewRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Review not found");
        }

        reviewRepository.deleteById(id);
        return ResponseEntity.ok("Review deleted by admin");
    }

}
