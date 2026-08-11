package com.ecommerce.auth.exception;

public class CustomExceptions {

    public static class EmailAlreadyExistsException extends RuntimeException {
        public EmailAlreadyExistsException(String message) {
            super(message);
        }
    }

    public static class InvalidCredentialsException extends RuntimeException {
        public InvalidCredentialsException(String message) {
            super(message);
        }
    }

    public static class AccountNotVerifiedException extends RuntimeException {
        public AccountNotVerifiedException(String message) {
            super(message);
        }
    }

    public static class InvalidOtpException extends RuntimeException {
        public InvalidOtpException(String message) {
            super(message);
        }
    }

    public static class OtpExpiredException extends RuntimeException {
        public OtpExpiredException(String message) {
            super(message);
        }
    }

    public static class UserNotFoundException extends RuntimeException {
        public UserNotFoundException(String message) {
            super(message);
        }
    }

    public static class PasswordMismatchException extends RuntimeException {
        public PasswordMismatchException(String message) {
            super(message);
        }
    }

    public static class ResendCooldownException extends RuntimeException {
        public ResendCooldownException(String message) {
            super(message);
        }
    }

    public static class AccountAlreadyVerifiedException extends RuntimeException {
        public AccountAlreadyVerifiedException(String message) {
            super(message);
        }
    }
}
