package com.ecommerce.auth.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "coupons")
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "coupon_id")
    private Integer id;

    @Column(name = "code", nullable = false, unique = true)
    private String code;

    @Column(name = "discount_type", nullable = false)
    private String discountType; // "PERCENTAGE" or "FIXED"

    @Column(name = "discount_value", nullable = false)
    private Double discountValue;

    @Column(name = "min_purchase_amount")
    private Double minPurchaseAmount = 0.0;

    @Column(name = "expiry_date")
    private LocalDateTime expiryDate;

    @Column(name = "active", nullable = false)
    private boolean active = true;

    public Coupon() {
    }

    public Coupon(String code, String discountType, Double discountValue, Double minPurchaseAmount, LocalDateTime expiryDate, boolean active) {
        this.code = code;
        this.discountType = discountType;
        this.discountValue = discountValue;
        this.minPurchaseAmount = minPurchaseAmount;
        this.expiryDate = expiryDate;
        this.active = active;
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDiscountType() {
        return discountType;
    }

    public void setDiscountType(String discountType) {
        this.discountType = discountType;
    }

    public Double getDiscountValue() {
        return discountValue;
    }

    public void setDiscountValue(Double discountValue) {
        this.discountValue = discountValue;
    }

    public Double getMinPurchaseAmount() {
        return minPurchaseAmount;
    }

    public void setMinPurchaseAmount(Double minPurchaseAmount) {
        this.minPurchaseAmount = minPurchaseAmount;
    }

    public LocalDateTime getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDateTime expiryDate) {
        this.expiryDate = expiryDate;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
