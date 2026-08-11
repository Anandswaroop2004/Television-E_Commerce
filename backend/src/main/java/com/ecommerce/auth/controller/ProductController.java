package com.ecommerce.auth.controller;

import com.ecommerce.auth.entity.*;
import com.ecommerce.auth.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductImageRepository productImageRepository;
    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;

    public ProductController(
            ProductRepository productRepository,
            CategoryRepository categoryRepository,
            ProductImageRepository productImageRepository,
            UserRepository userRepository,
            ReviewRepository reviewRepository
    ) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.productImageRepository = productImageRepository;
        this.userRepository = userRepository;
        this.reviewRepository = reviewRepository;
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
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = productRepository.findAll();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Integer id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> addProduct(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, Object> body
    ) {
        try {
            verifyAdmin(userDetails);

            String name = (String) body.get("name");
            String description = (String) body.get("description");
            Double price = Double.valueOf(body.get("price").toString());
            Integer stock = Integer.valueOf(body.get("stock").toString());
            Integer categoryId = Integer.valueOf(body.get("categoryId").toString());
            String imageUrl = (String) body.get("imageUrl");

            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new RuntimeException("Category not found"));

            Product product = new Product(name, description, price, stock, category);
            Product savedProduct = productRepository.save(product);

            if (imageUrl != null && !imageUrl.trim().isEmpty()) {
                ProductImage productImage = new ProductImage(savedProduct, imageUrl);
                productImageRepository.save(productImage);
            }

            return ResponseEntity.ok(savedProduct);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Integer id,
            @RequestBody Map<String, Object> body
    ) {
        try {
            verifyAdmin(userDetails);

            Product product = productRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            String name = (String) body.get("name");
            String description = (String) body.get("description");
            Double price = Double.valueOf(body.get("price").toString());
            Integer stock = Integer.valueOf(body.get("stock").toString());
            Integer categoryId = Integer.valueOf(body.get("categoryId").toString());
            String imageUrl = (String) body.get("imageUrl");

            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new RuntimeException("Category not found"));

            product.setName(name);
            product.setDescription(description);
            product.setPrice(price);
            product.setStock(stock);
            product.setCategory(category);
            product.setUpdatedAt(LocalDateTime.now());

            Product savedProduct = productRepository.save(product);

            if (imageUrl != null && !imageUrl.trim().isEmpty()) {
                if (savedProduct.getImages() != null && !savedProduct.getImages().isEmpty()) {
                    ProductImage productImage = savedProduct.getImages().get(0);
                    productImage = productImageRepository.findById(productImage.getId())
                            .orElse(productImage);
                    productImage.setImageUrl(imageUrl);
                    productImageRepository.save(productImage);
                } else {
                    ProductImage productImage = new ProductImage(savedProduct, imageUrl);
                    productImageRepository.save(productImage);
                }
            }

            return ResponseEntity.ok(savedProduct);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Integer id
    ) {
        try {
            verifyAdmin(userDetails);
            Product product = productRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Product not found"));
            productRepository.delete(product);
            return ResponseEntity.ok(Map.of("message", "Product deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/images/{imageId}")
    public ResponseEntity<?> deleteProductImage(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Integer imageId
    ) {
        try {
            verifyAdmin(userDetails);
            ProductImage image = productImageRepository.findById(imageId)
                    .orElseThrow(() -> new RuntimeException("Image not found"));
            productImageRepository.delete(image);
            return ResponseEntity.ok(Map.of("message", "Image deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // Public Product Reviews
    @GetMapping("/{id}/reviews")
    public ResponseEntity<?> getProductReviews(@PathVariable Integer id) {
        try {
            List<Review> reviews = reviewRepository.findByProductId(id);
            return ResponseEntity.ok(reviews);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/{id}/reviews")
    public ResponseEntity<?> addProductReview(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Integer id,
            @RequestBody Map<String, Object> body
    ) {
        try {
            if (userDetails == null) {
                throw new RuntimeException("Must be authenticated to review");
            }
            User user = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Product product = productRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            Integer rating = Integer.valueOf(body.get("rating").toString());
            String comment = (String) body.get("comment");

            Review review = new Review(product, user, rating, comment);
            Review saved = reviewRepository.save(review);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
