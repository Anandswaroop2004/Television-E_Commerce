package com.ecommerce.auth.service;

import com.ecommerce.auth.dto.*;

public interface UserService {
    ApiResponse register(RegisterRequest request);
    ApiResponse verify(VerifyEmailRequest request);
    LoginResponse login(LoginRequest request);
    ApiResponse forgotPassword(ForgotPasswordRequest request);
    ApiResponse resetPassword(ResetPasswordRequest request);
    ApiResponse verifyOtp(VerifyOtpRequest request);
    ApiResponse resendOtp(ResendOtpRequest request);
}
