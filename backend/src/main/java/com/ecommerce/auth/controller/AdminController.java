package com.ecommerce.auth.controller;

import com.ecommerce.auth.entity.*;
import com.ecommerce.auth.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ReviewRepository reviewRepository;
    private final CouponRepository couponRepository;

    public AdminController(
            UserRepository userRepository,
            OrderRepository orderRepository,
            ProductRepository productRepository,
            CategoryRepository categoryRepository,
            ReviewRepository reviewRepository,
            CouponRepository couponRepository
    ) {
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.reviewRepository = reviewRepository;
        this.couponRepository = couponRepository;
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

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            verifyAdmin(userDetails);
            List<User> users = userRepository.findAll();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<?> getUserById(@AuthenticationPrincipal UserDetails userDetails, @PathVariable Long id) {
        try {
            verifyAdmin(userDetails);
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<?> updateUserRole(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        try {
            verifyAdmin(userDetails);
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            String roleStr = body.get("role");
            Role role = Role.valueOf(roleStr.toUpperCase());
            user.setRole(role);
            userRepository.save(user);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/users/{id}/verify")
    public ResponseEntity<?> verifyUserDirectly(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id
    ) {
        try {
            verifyAdmin(userDetails);
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            user.setVerified(true);
            userRepository.save(user);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PatchMapping("/users/{id}/block")
    public ResponseEntity<?> toggleUserBlock(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id
    ) {
        try {
            verifyAdmin(userDetails);
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            user.setBlocked(!user.isBlocked());
            userRepository.save(user);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id
    ) {
        try {
            verifyAdmin(userDetails);
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            userRepository.delete(user);
            return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/orders")
    public ResponseEntity<?> getAllOrders(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            verifyAdmin(userDetails);
            List<Order> orders = orderRepository.findAll();
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<?> updateOrderStatus(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String id,
            @RequestBody Map<String, String> body
    ) {
        try {
            verifyAdmin(userDetails);
            Order order = orderRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Order not found"));
            String statusStr = body.get("status");
            OrderStatus status = OrderStatus.valueOf(statusStr.toUpperCase());
            order.setStatus(status);
            order.setUpdatedAt(LocalDateTime.now());
            orderRepository.save(order);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<?> getDashboardStats(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            verifyAdmin(userDetails);

            long totalProducts = productRepository.count();
            long totalCategories = categoryRepository.count();
            long totalUsers = userRepository.count();

            List<Order> allOrders = orderRepository.findAll();
            long totalOrders = allOrders.size();
            long pendingOrders = allOrders.stream().filter(o -> o.getStatus() == OrderStatus.PENDING).count();
            long completedOrders = allOrders.stream().filter(o -> o.getStatus() == OrderStatus.SUCCESS).count();

            double overallRevenue = 0.0;
            double todayRevenue = 0.0;
            double monthlyRevenue = 0.0;

            LocalDateTime now = LocalDateTime.now();
            for (Order o : allOrders) {
                if (o.getStatus() != OrderStatus.SUCCESS) continue;
                double amt = o.getTotalAmount();
                overallRevenue += amt;

                LocalDateTime ot = o.getCreatedAt();
                if (ot != null) {
                    if (ot.getYear() == now.getYear() && ot.getMonthValue() == now.getMonthValue()) {
                        monthlyRevenue += amt;
                        if (ot.getDayOfMonth() == now.getDayOfMonth()) {
                            todayRevenue += amt;
                        }
                    }
                }
            }

            // Recent Orders (limit to 10)
            List<Order> recentOrders = new ArrayList<>(allOrders);
            recentOrders.sort((o1, o2) -> {
                LocalDateTime t1 = o1.getCreatedAt() != null ? o1.getCreatedAt() : LocalDateTime.MIN;
                LocalDateTime t2 = o2.getCreatedAt() != null ? o2.getCreatedAt() : LocalDateTime.MIN;
                return t2.compareTo(t1);
            });
            if (recentOrders.size() > 10) {
                recentOrders = recentOrders.subList(0, 10);
            }

            // Recent Customers (limit 5)
            List<User> allUsers = userRepository.findAll();
            List<User> recentCustomers = new ArrayList<>(allUsers);
            recentCustomers.sort((u1, u2) -> {
                LocalDateTime t1 = u1.getCreatedAt() != null ? u1.getCreatedAt() : LocalDateTime.MIN;
                LocalDateTime t2 = u2.getCreatedAt() != null ? u2.getCreatedAt() : LocalDateTime.MIN;
                return t2.compareTo(t1);
            });
            if (recentCustomers.size() > 5) {
                recentCustomers = recentCustomers.subList(0, 5);
            }

            // Low Stock Products (stock < 10, limit 5)
            List<Product> allProducts = productRepository.findAll();
            List<Product> lowStockProducts = allProducts.stream()
                    .filter(p -> p.getStock() != null && p.getStock() < 15) // changed threshold slightly to capture more items if needed
                    .sorted(Comparator.comparing(Product::getStock))
                    .limit(5)
                    .toList();

            // Best Selling Products (aggregate order items)
            Map<Product, Integer> productSales = new HashMap<>();
            for (Order o : allOrders) {
                if (o.getStatus() != OrderStatus.SUCCESS) continue;
                if (o.getOrderItems() != null) {
                    for (OrderItem item : o.getOrderItems()) {
                        Product p = item.getProduct();
                        if (p != null) {
                            productSales.put(p, productSales.getOrDefault(p, 0) + item.getQuantity());
                        }
                    }
                }
            }
            List<Map<String, Object>> bestSelling = productSales.entrySet().stream()
                    .sorted((e1, e2) -> e2.getValue().compareTo(e1.getValue()))
                    .limit(5)
                    .map(entry -> {
                        Map<String, Object> map = new HashMap<>();
                        map.put("id", entry.getKey().getId());
                        map.put("name", entry.getKey().getName());
                        map.put("price", entry.getKey().getPrice());
                        map.put("salesCount", entry.getValue());
                        map.put("image", (entry.getKey().getImages() != null && !entry.getKey().getImages().isEmpty())
                                ? entry.getKey().getImages().get(0).getImageUrl() : "");
                        return map;
                    })
                    .toList();

            // Category Share
            Map<String, Double> categoryRevenue = new HashMap<>();
            for (Order o : allOrders) {
                if (o.getStatus() != OrderStatus.SUCCESS) continue;
                if (o.getOrderItems() != null) {
                    for (OrderItem item : o.getOrderItems()) {
                        Product p = item.getProduct();
                        if (p != null && p.getCategory() != null) {
                            String catName = p.getCategory().getName();
                            double itemTotal = item.getTotalPrice() != null ? item.getTotalPrice() : (item.getPricePerUnit() * item.getQuantity());
                            categoryRevenue.put(catName, categoryRevenue.getOrDefault(catName, 0.0) + itemTotal);
                        }
                    }
                }
            }
            List<Map<String, Object>> categoryShare = categoryRevenue.entrySet().stream()
                    .map(entry -> {
                        Map<String, Object> map = new HashMap<>();
                        map.put("categoryName", entry.getKey());
                        map.put("value", entry.getValue());
                        return map;
                    })
                    .toList();

            // Charts (last 6 months)
            List<Map<String, Object>> revenueChart = new ArrayList<>();
            List<Map<String, Object>> salesChart = new ArrayList<>();
            for (int i = 5; i >= 0; i--) {
                LocalDateTime target = now.minusMonths(i);
                String monthName = target.getMonth().name().substring(0, 3);
                double revSum = 0.0;
                long countSum = 0;
                for (Order o : allOrders) {
                    if (o.getStatus() != OrderStatus.SUCCESS) continue;
                    LocalDateTime ot = o.getCreatedAt();
                    if (ot != null && ot.getYear() == target.getYear() && ot.getMonthValue() == target.getMonthValue()) {
                        revSum += o.getTotalAmount();
                        countSum++;
                    }
                }
                Map<String, Object> revMap = new HashMap<>();
                revMap.put("label", monthName);
                revMap.put("value", revSum);
                revenueChart.add(revMap);

                Map<String, Object> salesMap = new HashMap<>();
                salesMap.put("label", monthName);
                salesMap.put("count", countSum);
                salesChart.add(salesMap);
            }

            // Recent Activity List
            List<Map<String, Object>> recentActivity = new ArrayList<>();
            for (Order o : recentOrders) {
                Map<String, Object> act = new HashMap<>();
                act.put("type", "ORDER");
                act.put("message", "Order " + o.getOrderId() + " was placed for ₹" + o.getTotalAmount() + " (" + o.getStatus() + ")");
                act.put("time", o.getCreatedAt() != null ? o.getCreatedAt().toString() : now.toString());
                recentActivity.add(act);
            }
            for (User u : recentCustomers) {
                Map<String, Object> act = new HashMap<>();
                act.put("type", "USER");
                act.put("message", "New customer " + u.getUsername() + " registered (" + u.getEmail() + ")");
                act.put("time", u.getCreatedAt() != null ? u.getCreatedAt().toString() : now.toString());
                recentActivity.add(act);
            }
            for (Product p : lowStockProducts) {
                Map<String, Object> act = new HashMap<>();
                act.put("type", "STOCK");
                act.put("message", "Product '" + p.getName() + "' is running low on stock (" + p.getStock() + " remaining)");
                act.put("time", now.toString());
                recentActivity.add(act);
            }
            recentActivity.sort((a, b) -> {
                String t1 = (String) a.get("time");
                String t2 = (String) b.get("time");
                return t2.compareTo(t1);
            });
            if (recentActivity.size() > 8) {
                recentActivity = recentActivity.subList(0, 8);
            }

            Map<String, Object> stats = new HashMap<>();
            stats.put("totalProducts", totalProducts);
            stats.put("totalCategories", totalCategories);
            stats.put("totalUsers", totalUsers);
            stats.put("totalOrders", totalOrders);
            stats.put("pendingOrders", pendingOrders);
            stats.put("completedOrders", completedOrders);
            stats.put("todayRevenue", todayRevenue);
            stats.put("monthlyRevenue", monthlyRevenue);
            stats.put("overallRevenue", overallRevenue);
            stats.put("recentOrders", recentOrders);
            stats.put("recentCustomers", recentCustomers);
            stats.put("lowStockProducts", lowStockProducts);
            stats.put("bestSellingProducts", bestSelling);
            stats.put("categoryShare", categoryShare);
            stats.put("revenueChart", revenueChart);
            stats.put("salesChart", salesChart);
            stats.put("recentActivity", recentActivity);

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/analytics")
    public ResponseEntity<?> getAnalytics(@AuthenticationPrincipal UserDetails userDetails) {
        // Return same aggregated stats for simple reuse
        return getDashboardStats(userDetails);
    }

    // Reviews Endpoints
    @GetMapping("/reviews")
    public ResponseEntity<?> getAllReviews(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            verifyAdmin(userDetails);
            return ResponseEntity.ok(reviewRepository.findAll());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/reviews/{id}")
    public ResponseEntity<?> deleteReview(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Integer id
    ) {
        try {
            verifyAdmin(userDetails);
            Review review = reviewRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Review not found"));
            reviewRepository.delete(review);
            return ResponseEntity.ok(Map.of("message", "Review deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // Coupons Endpoints
    @GetMapping("/coupons")
    public ResponseEntity<?> getAllCoupons(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            verifyAdmin(userDetails);
            return ResponseEntity.ok(couponRepository.findAll());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/coupons")
    public ResponseEntity<?> addCoupon(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Coupon coupon
    ) {
        try {
            verifyAdmin(userDetails);
            if (coupon.getCode() == null || coupon.getCode().trim().isEmpty()) {
                throw new RuntimeException("Coupon code cannot be empty");
            }
            if (couponRepository.findByCode(coupon.getCode()).isPresent()) {
                throw new RuntimeException("Coupon code already exists");
            }
            Coupon saved = couponRepository.save(coupon);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/coupons/{id}")
    public ResponseEntity<?> updateCoupon(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Integer id,
            @RequestBody Coupon details
    ) {
        try {
            verifyAdmin(userDetails);
            Coupon coupon = couponRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Coupon not found"));
            coupon.setCode(details.getCode());
            coupon.setDiscountType(details.getDiscountType());
            coupon.setDiscountValue(details.getDiscountValue());
            coupon.setMinPurchaseAmount(details.getMinPurchaseAmount());
            coupon.setExpiryDate(details.getExpiryDate());
            coupon.setActive(details.isActive());
            Coupon saved = couponRepository.save(coupon);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/coupons/{id}")
    public ResponseEntity<?> deleteCoupon(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Integer id
    ) {
        try {
            verifyAdmin(userDetails);
            Coupon coupon = couponRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Coupon not found"));
            couponRepository.delete(coupon);
            return ResponseEntity.ok(Map.of("message", "Coupon deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
