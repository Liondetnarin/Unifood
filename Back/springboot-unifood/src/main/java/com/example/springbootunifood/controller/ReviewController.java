package com.example.springbootunifood.controller;

import com.example.springbootunifood.ProfanityFilterUtil;
import com.example.springbootunifood.model.Reviews;
import com.example.springbootunifood.repository.RestaurantRepository;
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

    private final RestaurantRepository restaurantRepository;
    private final ReviewRepository reviewRepository;

    public ReviewController(ReviewRepository reviewRepository, RestaurantRepository restaurantRepository) {
        this.reviewRepository = reviewRepository;
        this.restaurantRepository = restaurantRepository;
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

        // ตั้งสถานะเริ่มต้นเป็น pending (รอแอดมินอนุมัติ)
        review.setStatus("pending");

        // ดึงชื่อผู้ใช้จาก userId
        userRepository.findById(review.getUserId()).ifPresent(user -> {
            review.setUserName(user.getName());
        });

        Reviews saved = reviewRepository.save(review);
        return ResponseEntity.ok(saved);
    }

    // ลบรีวิวตาม ID
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable String id) {
        Optional<Reviews> reviewOpt = reviewRepository.findById(id);

        if (!reviewOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Review not found");
        }

        Reviews review = reviewOpt.get();
        String restaurantId = review.getRestaurantId();

        reviewRepository.deleteById(id);
        updateRestaurantAverage(restaurantId);

        return ResponseEntity.ok("Review deleted");
    }

    // แก้ไขรีวิวของตัวเอง
    @PutMapping("/{id}")
    public ResponseEntity<?> updateReview(@PathVariable String id, @RequestBody Reviews updatedReview) {
        return reviewRepository.findById(id).map(existing -> {
            existing.setTasteRating(updatedReview.getTasteRating());
            existing.setCleanlinessRating(updatedReview.getCleanlinessRating());
            existing.setSpeedRating(updatedReview.getSpeedRating());
            existing.setValueRating(updatedReview.getValueRating());
            existing.setComment(updatedReview.getComment());
            existing.setCreatedAt(LocalDateTime.now());

            reviewRepository.save(existing);
            updateRestaurantAverage(existing.getRestaurantId());

            return ResponseEntity.ok(existing);
        }).orElse(ResponseEntity.notFound().build());
    }

    // แอดมินอนุมัติรีวิว
    @PutMapping("/admin/approve/{id}")
    public ResponseEntity<?> approveReview(@PathVariable String id) {
        Optional<Reviews> reviewOpt = reviewRepository.findById(id);
        if (reviewOpt.isPresent()) {
            Reviews review = reviewOpt.get();
            review.setStatus("approved");
            reviewRepository.save(review);

            updateRestaurantAverage(review.getRestaurantId());
            return ResponseEntity.ok(review);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("ไม่พบรีวิวนี้");
        }
    }

    // แอดมินลบรีวิว
    @DeleteMapping("/admin/{id}")
    public ResponseEntity<?> deleteReviewByAdmin(@PathVariable String id) {
        Optional<Reviews> reviewOpt = reviewRepository.findById(id);

        if (!reviewOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Review not found");
        }

        Reviews review = reviewOpt.get();
        String restaurantId = review.getRestaurantId();

        reviewRepository.deleteById(id);
        updateRestaurantAverage(review.getRestaurantId());

        return ResponseEntity.ok("Review deleted by admin");
    }

    // คำนวณค่าเฉลี่ย
    private void updateRestaurantAverage(String restaurantId) {
        List<Reviews> approvedReviews = reviewRepository.findByRestaurantIdAndStatus(restaurantId, "approved");

        // ถ้าไม่มีรีวิว
        if (approvedReviews.isEmpty()) {
            restaurantRepository.findById(restaurantId).ifPresent(restaurant -> {
                restaurant.setAverageRating(0.0);
                restaurant.setReviewsCount(0);
                restaurantRepository.save(restaurant);
            });
            return;
        }

        // คำนวณคะแนนเฉลี่ย
        double totalAvg = 0.0;

        for (Reviews r : approvedReviews) {
            double avg = (r.getTasteRating() + r.getCleanlinessRating() + r.getSpeedRating() + r.getValueRating()) / 4.0;
            totalAvg += avg;
        }

        double finalAverage = totalAvg / approvedReviews.size();

        restaurantRepository.findById(restaurantId).ifPresent(restaurant -> {
            restaurant.setAverageRating(Math.round(finalAverage * 10.0));
            restaurant.setReviewsCount(approvedReviews.size());
            restaurantRepository.save(restaurant);
        });
    }

}
