package com.example.springbootunifood.repository;

import com.example.springbootunifood.model.Restaurants;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface RestaurantRepository extends MongoRepository<Restaurants, String> {
    List<Restaurants> findByNameContainingIgnoreCaseOrCategoryContainingIgnoreCase(String name, String category);
}
