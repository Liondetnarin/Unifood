package com.example.springbootunifood.controller;

import com.example.springbootunifood.model.Restaurants;
import com.example.springbootunifood.repository.RestaurantRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
@CrossOrigin(origins = "*") // อนุญาตให้ frontend React เข้าถึง
public class RestaurantController {

    private final RestaurantRepository restaurantRepository;

    // Constructor Injection
    public RestaurantController(RestaurantRepository restaurantRepository) {
        this.restaurantRepository = restaurantRepository;
    }

    // ดึงร้านอาหารทั้งหมด
    @GetMapping
    public List<Restaurants> getAllRestaurants() {
        return restaurantRepository.findAll();
    }

    // เพิ่มร้านอาหารใหม่
    @PostMapping
    public Restaurants createRestaurant(@RequestBody Restaurants restaurant) {
        return restaurantRepository.save(restaurant);
    }

    // ลบร้านอาหารตาม ID
    @DeleteMapping("/{id}")
    public void deleteRestaurant(@PathVariable String id) {
        restaurantRepository.deleteById(id);
    }
}
