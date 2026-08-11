package com.ecommerce.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record VerifyOtpRequest(
        @NotBlank(message = "Email is mandatory")
        @Email(message = "Please provide a valid email address")
        String email,

        @NotBlank(message = "OTP is mandatory")
        @Pattern(regexp = "^[0-9]{6}$", message = "OTP must contain exactly 6 digits")
        String otp
) {}
