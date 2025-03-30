package com.example.springbootunifood.repository;

import com.example.springbootunifood.model.Restaurants;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RestaurantRepository extends MongoRepository<Restaurants, String> {
}
