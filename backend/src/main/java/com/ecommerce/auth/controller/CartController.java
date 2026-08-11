package com.ecommerce.auth.controller;

import com.ecommerce.auth.entity.CartItem;
import com.ecommerce.auth.entity.Product;
import com.ecommerce.auth.entity.User;
import com.ecommerce.auth.repository.CartItemRepository;
import com.ecommerce.auth.repository.ProductRepository;
import com.ecommerce.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    private User getAuthenticatedUser(UserDetails userDetails) {
        if (userDetails == null) {
            throw new RuntimeException("Not authenticated");
        }
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping
    public ResponseEntity<List<CartItem>> getCart(@AuthenticationPrincipal UserDetails userDetails) {
        User user = getAuthenticatedUser(userDetails);
        List<CartItem> items = cartItemRepository.findByUser(user);
        return ResponseEntity.ok(items);
    }

    @PostMapping
    @Transactional
    public ResponseEntity<CartItem> addToCart(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, Integer> payload) {
        User user = getAuthenticatedUser(userDetails);
        Integer productId = payload.get("productId");
        Integer quantity = payload.getOrDefault("quantity", 1);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Optional<CartItem> existingItem = cartItemRepository.findByUserAndProduct(user, product);
        CartItem cartItem;
        if (existingItem.isPresent()) {
            cartItem = existingItem.get();
            cartItem.setQuantity(cartItem.getQuantity() + quantity);
        } else {
            cartItem = new CartItem(user, product, quantity);
        }

        CartItem saved = cartItemRepository.save(cartItem);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{productId}")
    @Transactional
    public ResponseEntity<CartItem> updateCartItem(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Integer productId,
            @RequestBody Map<String, Integer> payload) {
        User user = getAuthenticatedUser(userDetails);
        Integer quantity = payload.get("quantity");

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        CartItem cartItem = cartItemRepository.findByUserAndProduct(user, product)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (quantity <= 0) {
            cartItemRepository.delete(cartItem);
            return ResponseEntity.ok(null);
        } else {
            cartItem.setQuantity(quantity);
            CartItem saved = cartItemRepository.save(cartItem);
            return ResponseEntity.ok(saved);
        }
    }

    @DeleteMapping("/{productId}")
    @Transactional
    public ResponseEntity<Map<String, Object>> removeFromCart(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Integer productId) {
        User user = getAuthenticatedUser(userDetails);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        CartItem cartItem = cartItemRepository.findByUserAndProduct(user, product)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        cartItemRepository.delete(cartItem);
        return ResponseEntity.ok(Map.of("success", true, "message", "Product removed from cart"));
    }

    @DeleteMapping
    @Transactional
    public ResponseEntity<Map<String, Object>> clearCart(@AuthenticationPrincipal UserDetails userDetails) {
        User user = getAuthenticatedUser(userDetails);
        cartItemRepository.deleteByUser(user);
        return ResponseEntity.ok(Map.of("success", true, "message", "Cart cleared successfully"));
    }
}
