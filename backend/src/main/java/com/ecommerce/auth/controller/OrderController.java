package com.ecommerce.auth.controller;

import com.ecommerce.auth.dto.PaymentVerificationRequest;
import com.ecommerce.auth.dto.RazorpayOrderResponse;
import com.ecommerce.auth.entity.CartItem;
import com.ecommerce.auth.entity.Order;
import com.ecommerce.auth.entity.OrderItem;
import com.ecommerce.auth.entity.OrderStatus;
import com.ecommerce.auth.entity.Product;
import com.ecommerce.auth.entity.User;
import com.ecommerce.auth.repository.CartItemRepository;
import com.ecommerce.auth.repository.OrderItemRepository;
import com.ecommerce.auth.repository.OrderRepository;
import com.ecommerce.auth.repository.ProductRepository;
import com.ecommerce.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    private User getAuthenticatedUser(UserDetails userDetails) {
        if (userDetails == null) {
            throw new RuntimeException("Not authenticated");
        }
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping
    public ResponseEntity<List<Order>> getOrders(@AuthenticationPrincipal UserDetails userDetails) {
        User user = getAuthenticatedUser(userDetails);
        List<Order> orders = orderRepository.findByUser(user);
        return ResponseEntity.ok(orders);
    }

    @PostMapping("/checkout")
    @Transactional
    public ResponseEntity<?> checkout(@AuthenticationPrincipal UserDetails userDetails) {
        User user = getAuthenticatedUser(userDetails);
        List<CartItem> cartItems = cartItemRepository.findByUser(user);

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // Calculate total amount from cart items
        double subtotal = 0.0;
        for (CartItem item : cartItems) {
            subtotal += item.getProduct().getPrice().doubleValue() * item.getQuantity();
        }

        double shipping = (subtotal > 50000.0 || subtotal == 0.0) ? 0.0 : 500.0;
        double tax = subtotal * 0.08;
        double totalAmount = subtotal + shipping + tax;

        // Generate unique order ID
        String orderId = "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        // Create Order in PENDING status
        Order order = new Order();
        order.setOrderId(orderId);
        order.setUser(user);
        order.setTotalAmount(totalAmount);
        order.setStatus(OrderStatus.PENDING);
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());

        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();
            if (product.getStock() < cartItem.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName());
            }

            // Create OrderItem (do not deduct stock yet)
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPricePerUnit(product.getPrice().doubleValue());
            orderItem.setTotalPrice(product.getPrice().doubleValue() * cartItem.getQuantity());
            orderItems.add(orderItem);
        }

        order.setOrderItems(orderItems);

        // Convert total amount to paise for Razorpay
        long amountInPaise = Math.round(totalAmount * 100);

        String razorpayOrderId = null;

        // Call Razorpay API only if secret is configured and not the default placeholder
        if (razorpayKeySecret != null && !razorpayKeySecret.trim().isEmpty() && !razorpayKeySecret.equals("YOUR_RAZORPAY_SECRET_KEY")) {
            try {
                String auth = razorpayKeyId + ":" + razorpayKeySecret;
                String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes(StandardCharsets.UTF_8));
                String authHeader = "Basic " + encodedAuth;

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                headers.set("Authorization", authHeader);

                Map<String, Object> requestMap = new HashMap<>();
                requestMap.put("amount", amountInPaise);
                requestMap.put("currency", "INR");
                requestMap.put("receipt", orderId);

                HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestMap, headers);
                RestTemplate restTemplate = new RestTemplate();
                ResponseEntity<Map> response = restTemplate.postForEntity("https://api.razorpay.com/v1/orders", entity, Map.class);
                
                if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                    razorpayOrderId = (String) response.getBody().get("id");
                }
            } catch (Exception e) {
                System.err.println("Failed to create order on Razorpay, falling back to mock: " + e.getMessage());
            }
        }

        // Mock fallback if Razorpay API call fails or is bypassed
        if (razorpayOrderId == null) {
            razorpayOrderId = "order_mock_" + UUID.randomUUID().toString().substring(0, 14);
            System.out.println("Razorpay secret not configured or call failed. Using mock order ID: " + razorpayOrderId);
        }

        order.setRazorpayOrderId(razorpayOrderId);

        // Save order
        orderRepository.save(order);

        // Return details for frontend
        RazorpayOrderResponse response = new RazorpayOrderResponse(
            orderId,
            amountInPaise,
            "INR",
            razorpayOrderId,
            razorpayKeyId,
            user.getUsername(),
            user.getEmail()
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify")
    @Transactional
    public ResponseEntity<?> verifyPayment(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody PaymentVerificationRequest request) {
        
        User user = getAuthenticatedUser(userDetails);
        
        // Find local order
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found: " + request.getOrderId()));
                
        // Ensure order belongs to this user
        if (!order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to order");
        }

        // Check if signature is mock signature or if keys are not configured
        boolean signatureValid = false;
        
        if (request.getRazorpayOrderId().startsWith("order_mock_") || 
            razorpayKeySecret == null || 
            razorpayKeySecret.trim().isEmpty() || 
            razorpayKeySecret.equals("YOUR_RAZORPAY_SECRET_KEY")) {
            
            System.out.println("Bypassing signature check for mock/unconfigured Razorpay integration");
            signatureValid = true;
        } else {
            // Verify signature via HMAC-SHA256
            signatureValid = verifySignature(
                request.getRazorpayOrderId(), 
                request.getRazorpayPaymentId(), 
                request.getRazorpaySignature(), 
                razorpayKeySecret
            );
        }

        if (signatureValid) {
            order.setStatus(OrderStatus.SUCCESS);
            order.setUpdatedAt(LocalDateTime.now());
            
            // Deduct stock for products upon successful payment
            for (OrderItem item : order.getOrderItems()) {
                Product product = item.getProduct();
                if (product.getStock() < item.getQuantity()) {
                    throw new RuntimeException("Insufficient stock for product: " + product.getName());
                }
                product.setStock(product.getStock() - item.getQuantity());
                productRepository.save(product);
            }
            
            // Save updated order
            orderRepository.save(order);
            
            // Clear user's cart
            cartItemRepository.deleteByUser(user);
            
            return ResponseEntity.ok(Map.of("message", "Payment verified successfully", "orderId", order.getOrderId()));
        } else {
            order.setStatus(OrderStatus.FAILED);
            order.setUpdatedAt(LocalDateTime.now());
            orderRepository.save(order);
            
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid payment signature"));
        }
    }

    private boolean verifySignature(String orderId, String paymentId, String signature, String secret) {
        try {
            String data = orderId + "|" + paymentId;
            Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
            SecretKeySpec secret_key = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            sha256_HMAC.init(secret_key);
            byte[] hash = sha256_HMAC.doFinal(data.getBytes(StandardCharsets.UTF_8));
            
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString().equals(signature);
        } catch (Exception e) {
            return false;
        }
    }
}

