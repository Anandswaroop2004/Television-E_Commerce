package com.ecommerce.auth.service;

public interface EmailService {
    void sendVerificationCode(String toEmail, String fullName, String code);
    void sendPasswordResetOtp(String toEmail, String fullName, String otp);
}
