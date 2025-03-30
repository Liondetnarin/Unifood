package com.example.springbootunifood.repository;

import com.example.springbootunifood.model.Reviews;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ReviewRepository extends MongoRepository<Reviews, String> {

    // ดึงรีวิวทั้งหมดของร้านอาหารร้านหนึ่ง
    List<Reviews> findByRestaurantId(String restaurantId);

    // ดึงรีวิวทั้งหมดของผู้ใช้
    List<Reviews> findByUserId(String userId);
}
