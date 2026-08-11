package com.ecommerce.auth.dto;

public record ApiResponse(
        boolean success,
        String message
) {}
