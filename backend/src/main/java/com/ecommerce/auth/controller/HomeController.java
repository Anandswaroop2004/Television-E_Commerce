package com.ecommerce.auth.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class HomeController {

    @GetMapping("/home")
    public ResponseEntity<Map<String, Object>> getHomeDetails(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Welcome to the Secure E-commerce Dashboard!",
                "email", userDetails.getUsername(),
                "authorities", userDetails.getAuthorities()
        ));
    }
}
