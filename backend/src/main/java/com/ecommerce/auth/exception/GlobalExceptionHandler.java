package com.ecommerce.auth.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Helper class to represent structured JSON errors
    public record ErrorResponse(
            boolean success,
            String message,
            Map<String, String> errors,
            LocalDateTime timestamp
    ) {}

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        ErrorResponse response = new ErrorResponse(
            false,
            "Validation failed",
            errors,
            LocalDateTime.now()
        );
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler({
            CustomExceptions.EmailAlreadyExistsException.class,
            CustomExceptions.UsernameAlreadyExistsException.class,
            CustomExceptions.InvalidOtpException.class,
            CustomExceptions.OtpExpiredException.class,
            CustomExceptions.PasswordMismatchException.class,
            CustomExceptions.ResendCooldownException.class,
            CustomExceptions.AccountAlreadyVerifiedException.class
    })
    public ResponseEntity<ErrorResponse> handleBadRequestExceptions(RuntimeException ex) {
        ErrorResponse response = new ErrorResponse(
            false,
            ex.getMessage(),
            null,
            LocalDateTime.now()
        );
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler({
            CustomExceptions.InvalidCredentialsException.class,
            CustomExceptions.AccountNotVerifiedException.class
    })
    public ResponseEntity<ErrorResponse> handleUnauthorizedExceptions(RuntimeException ex) {
        ErrorResponse response = new ErrorResponse(
            false,
            ex.getMessage(),
            null,
            LocalDateTime.now()
        );
        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(CustomExceptions.UserNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFoundExceptions(RuntimeException ex) {
        ErrorResponse response = new ErrorResponse(
            false,
            ex.getMessage(),
            null,
            LocalDateTime.now()
        );
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleAllOtherExceptions(Exception ex) {
        ErrorResponse response = new ErrorResponse(
            false,
            ex.getMessage() != null && ex.getMessage().contains("Duplicate entry") 
                ? "This username or email is already registered. Please try logging in or use another username."
                : "An unexpected error occurred: " + ex.getMessage(),
            null,
            LocalDateTime.now()
        );
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
