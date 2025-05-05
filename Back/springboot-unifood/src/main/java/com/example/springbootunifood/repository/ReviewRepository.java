package com.example.springbootunifood.repository;

import com.example.springbootunifood.model.Reviews;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ReviewRepository extends MongoRepository<Reviews, String> {

    List<Reviews> findByRestaurantIdAndStatus(String restaurantId, String status);
}
