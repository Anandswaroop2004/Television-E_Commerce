package com.ecommerce.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record VerifyEmailRequest(
        @NotBlank(message = "Email is mandatory")
        @Email(message = "Please provide a valid email address")
        String email,

        @NotBlank(message = "Verification code is mandatory")
        String code
) {}
