package com.ecommerce.auth.dto;

public class RazorpayOrderResponse {
    private String id;
    private Long amount;
    private String currency;
    private String razorpayOrderId;
    private String keyId;
    private String customerName;
    private String customerEmail;

    public RazorpayOrderResponse() {
    }

    public RazorpayOrderResponse(String id, Long amount, String currency, String razorpayOrderId, String keyId, String customerName, String customerEmail) {
        this.id = id;
        this.amount = amount;
        this.currency = currency;
        this.razorpayOrderId = razorpayOrderId;
        this.keyId = keyId;
        this.customerName = customerName;
        this.customerEmail = customerEmail;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Long getAmount() {
        return amount;
    }

    public void setAmount(Long amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getRazorpayOrderId() {
        return razorpayOrderId;
    }

    public void setRazorpayOrderId(String razorpayOrderId) {
        this.razorpayOrderId = razorpayOrderId;
    }

    public String getKeyId() {
        return keyId;
    }

    public void setKeyId(String keyId) {
        this.keyId = keyId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }
}
