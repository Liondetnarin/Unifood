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
        List<Restaurants> all = restaurantRepository.findAll();
        all.forEach(r -> System.out.println("ok " + r.getName() + " - " + r.getImageUrl()));
        return all;
    }

    // ดึงร้านอาหารเดี่ยวตาม ID
    @GetMapping("/{id}")
    public Restaurants getRestaurantById(@PathVariable String id) {
        return restaurantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ไม่พบร้านที่ต้องการ"));
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

    @PutMapping("/{id}")
    public Restaurants updateRestaurant(@PathVariable String id, @RequestBody Restaurants updated) {
        updated.setId(id);
        return restaurantRepository.save(updated);
    }

}
