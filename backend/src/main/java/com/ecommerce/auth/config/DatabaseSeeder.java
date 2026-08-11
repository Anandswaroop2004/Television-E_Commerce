package com.ecommerce.auth.config;

import com.ecommerce.auth.entity.*;
import com.ecommerce.auth.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;
    private final CouponRepository couponRepository;

    public DatabaseSeeder(
            ProductRepository productRepository,
            UserRepository userRepository,
            ReviewRepository reviewRepository,
            CouponRepository couponRepository
    ) {
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.reviewRepository = reviewRepository;
        this.couponRepository = couponRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Seed Coupons if empty
        if (couponRepository.count() == 0) {
            couponRepository.save(new Coupon("WELCOME10", "PERCENTAGE", 10.0, 1000.0, LocalDateTime.now().plusMonths(3), true));
            couponRepository.save(new Coupon("BIGSAVINGS", "FIXED", 5000.0, 50000.0, LocalDateTime.now().plusMonths(6), true));
            couponRepository.save(new Coupon("FESTIVE20", "PERCENTAGE", 20.0, 2000.0, LocalDateTime.now().plusMonths(1), true));
            couponRepository.save(new Coupon("EXPIRED5", "PERCENTAGE", 5.0, 500.0, LocalDateTime.now().minusDays(1), false));
        }

        // Seed Reviews if empty
        if (reviewRepository.count() == 0) {
            List<Product> products = productRepository.findAll();
            List<User> users = userRepository.findAll();
            
            if (!products.isEmpty() && !users.isEmpty()) {
                Product p1 = products.get(0);
                Product p2 = products.size() > 1 ? products.get(1) : p1;
                
                User customer = users.stream().filter(u -> u.getRole() == Role.CUSTOMER).findFirst().orElse(users.get(0));
                User admin = users.stream().filter(u -> u.getRole() == Role.ADMIN).findFirst().orElse(users.get(0));
                
                reviewRepository.save(new Review(p1, customer, 5, "Unbelievable picture quality! The self-lit OLED pixels are absolutely gorgeous. Highly recommend."));
                reviewRepository.save(new Review(p1, admin, 4, "Great TV overall, although the speakers could be slightly punchier. Excellent for gaming."));
                reviewRepository.save(new Review(p2, customer, 5, "Sony's cognitive processor really makes a difference. Colors are natural and the motion is incredibly smooth."));
            }
        }
    }
}
