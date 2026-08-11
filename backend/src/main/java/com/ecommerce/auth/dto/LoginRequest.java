package com.ecommerce.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = "Email or Username is mandatory")
        String email,

        @NotBlank(message = "Password is mandatory")
        String password,

        boolean rememberMe
) {}
