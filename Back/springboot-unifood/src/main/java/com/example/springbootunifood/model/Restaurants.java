package com.example.springbootunifood.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "restaurants" )
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Restaurants {

    @Id
    private String id;
    private String name;
    private String category;
    private String location;
    private double averageRating;
    private int reviewsCount;
    private String imageUrl;
}
