package com.ecommerce.auth.controller;

import com.ecommerce.auth.entity.Category;
import com.ecommerce.auth.entity.Role;
import com.ecommerce.auth.entity.User;
import com.ecommerce.auth.repository.CategoryRepository;
import com.ecommerce.auth.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public CategoryController(CategoryRepository categoryRepository, UserRepository userRepository) {
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }

    private User verifyAdmin(UserDetails userDetails) {
        if (userDetails == null) {
            throw new RuntimeException("Not authenticated");
        }
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getRole() != Role.ADMIN) {
            throw new RuntimeException("Access Denied: Admin role required");
        }
        return user;
    }

    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        return ResponseEntity.ok(categories);
    }

    @PostMapping
    public ResponseEntity<?> addCategory(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, String> body
    ) {
        try {
            verifyAdmin(userDetails);
            String name = body.get("name");
            if (name == null || name.trim().isEmpty()) {
                throw new RuntimeException("Category name cannot be empty");
            }
            Category category = new Category(name);
            Category saved = categoryRepository.save(category);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCategory(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Integer id,
            @RequestBody Map<String, String> body
    ) {
        try {
            verifyAdmin(userDetails);
            Category category = categoryRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            String name = body.get("name");
            if (name == null || name.trim().isEmpty()) {
                throw new RuntimeException("Category name cannot be empty");
            }
            category.setName(name);
            Category saved = categoryRepository.save(category);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Integer id
    ) {
        try {
            verifyAdmin(userDetails);
            Category category = categoryRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            categoryRepository.delete(category);
            return ResponseEntity.ok(Map.of("message", "Category deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
