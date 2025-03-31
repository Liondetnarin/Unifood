package com.example.springbootunifood.controller;

import com.example.springbootunifood.model.User;
import com.example.springbootunifood.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginUser) {
        System.out.println("Login with: " + loginUser.getEmail());

        Optional<User> userOpt = userRepository.findByEmail(loginUser.getEmail());

        if (userOpt.isEmpty()) {
            System.out.println("Email not found: " + loginUser.getEmail());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }

        User user = userOpt.get();
        System.out.println("Password from DB: " + user.getPassword());

        if (!user.getPassword().equals(loginUser.getPassword())) {
            System.out.println("Password mismatch");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }

        System.out.println("Login success");
        return ResponseEntity.ok(user);
    }
}
