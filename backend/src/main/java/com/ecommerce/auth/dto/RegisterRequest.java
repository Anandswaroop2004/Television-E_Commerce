package com.ecommerce.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "Username is mandatory")
        String username,

        @NotBlank(message = "Email is mandatory")
        @Email(message = "Please provide a valid email address")
        String email,

        @NotBlank(message = "Password is mandatory")
        @Size(min = 8, message = "Password must be at least 8 characters long")
        String password,

        @NotBlank(message = "Confirm password is mandatory")
        String confirmPassword
) {}
