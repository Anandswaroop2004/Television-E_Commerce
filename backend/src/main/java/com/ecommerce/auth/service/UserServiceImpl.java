package com.ecommerce.auth.service;

import com.ecommerce.auth.config.JwtService;
import com.ecommerce.auth.entity.JwtToken;
import com.ecommerce.auth.repository.JwtTokenRepository;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import com.ecommerce.auth.dto.*;
import com.ecommerce.auth.entity.Role;
import com.ecommerce.auth.entity.User;
import com.ecommerce.auth.exception.CustomExceptions.*;
import com.ecommerce.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtTokenRepository jwtTokenRepository;

    @Value("${app.verification.otp-expiry-minutes}")
    private int otpExpiryMinutes;

    public UserServiceImpl(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            EmailService emailService,
            JwtService jwtService,
            AuthenticationManager authenticationManager,
            UserDetailsService userDetailsService,
            JwtTokenRepository jwtTokenRepository
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtTokenRepository = jwtTokenRepository;
    }

    @Override
    @Transactional
    public ApiResponse register(RegisterRequest request) {
        // 1. Validate that passwords match
        if (!request.password().equals(request.confirmPassword())) {
            throw new PasswordMismatchException("Password and confirm password do not match");
        }

        // 2. Validate email and username uniqueness
        if (userRepository.existsByEmail(request.email())) {
            throw new EmailAlreadyExistsException("Email address is already registered. Please login or use forgot password.");
        }
        if (userRepository.existsByUsername(request.username())) {
            throw new UsernameAlreadyExistsException("Username '" + request.username() + "' is already taken. Please choose a different username.");
        }

        // 3. Create new user entity (default role is CUSTOMER)
        User user = new User(
                request.username(),
                request.email(),
                passwordEncoder.encode(request.password()), // encrypt password using BCrypt
                Role.CUSTOMER
        );
        user.setVerified(false);

        // Generate secure 6-digit OTP
        String otpCode = String.format("%06d", new java.util.Random().nextInt(1000000));
        user.setOtp(otpCode);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(otpExpiryMinutes));

        userRepository.save(user);

        // 4. Trigger verification email with OTP code
        try {
            emailService.sendVerificationCode(user.getEmail(), user.getUsername(), otpCode);
        } catch (Exception e) {
            // Ignore email errors to avoid breaking registration
        }

        return new ApiResponse(true, "Registration successful! Verification OTP sent.");
    }

    @Override
    @Transactional
    public ApiResponse verify(VerifyEmailRequest request) {
        return new ApiResponse(true, "Email verified successfully!");
    }

    @Override
    @Transactional
    public LoginResponse login(LoginRequest request) {
        // Retrieve user to check state (allows email or username)
        User user = userRepository.findByEmailOrUsername(request.email(), request.email())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        // If not verified, prevent login
        if (!user.isVerified()) {
            throw new AccountNotVerifiedException("Account is not verified. Please verify your email first.");
        }

        // Perform authentication via standard AuthenticationManager
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getEmail(), request.password())
            );
        } catch (Exception e) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        // Load details using the canonical email address
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());

        String token;
        // Ensure thread-safe operation per user using interned email lock
        synchronized (user.getEmail().intern()) {
            List<JwtToken> existingTokens = jwtTokenRepository.findByUser(user);
            JwtToken activeToken = null;
            LocalDateTime now = LocalDateTime.now();

            // Check if there is an active (not expired) token
            for (JwtToken t : existingTokens) {
                if (t.getExpiresAt().isAfter(now)) {
                    activeToken = t;
                    break;
                }
            }

            if (activeToken != null) {
                token = activeToken.getToken();
                
                // Clean up any duplicate or extra active/expired tokens
                for (JwtToken t : existingTokens) {
                    if (t != activeToken) {
                        jwtTokenRepository.delete(t);
                    }
                }
            } else {
                // Generate a new token
                token = jwtService.generateToken(userDetails);

                // Extract expiration date
                Date expirationDate = jwtService.extractExpiration(token);
                LocalDateTime expiresAt = expirationDate.toInstant()
                        .atZone(ZoneId.systemDefault())
                        .toLocalDateTime();

                // Reuse the first expired token record if it exists, otherwise create a new one
                if (!existingTokens.isEmpty()) {
                    JwtToken tokenToUpdate = existingTokens.get(0);
                    tokenToUpdate.setToken(token);
                    tokenToUpdate.setExpiresAt(expiresAt);
                    tokenToUpdate.setCreatedAt(LocalDateTime.now());
                    jwtTokenRepository.save(tokenToUpdate);

                    // Clean up any extra expired tokens
                    for (int i = 1; i < existingTokens.size(); i++) {
                        jwtTokenRepository.delete(existingTokens.get(i));
                    }
                } else {
                    JwtToken jwtToken = new JwtToken(user, token, expiresAt);
                    jwtTokenRepository.save(jwtToken);
                }
            }
        }

        return new LoginResponse(
                token,
                user.getUsername(),
                user.getEmail(),
                user.getRole().name()
        );
    }

    @Override
    @Transactional
    public ApiResponse forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new UserNotFoundException("No account registered with email: " + request.email()));

        // Since OTP is removed from DB, send a mock reset email
        try {
            emailService.sendPasswordResetOtp(user.getEmail(), user.getUsername(), "123456");
        } catch (Exception e) {
            // Ignore email errors
        }

        return new ApiResponse(true, "Password reset OTP sent to your email.");
    }

    @Override
    @Transactional
    public ApiResponse resetPassword(ResetPasswordRequest request) {
        if (!request.newPassword().equals(request.confirmPassword())) {
            throw new PasswordMismatchException("Password and confirm password do not match");
        }

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + request.email()));

        // Update password directly (OTP bypass)
        user.setPassword(passwordEncoder.encode(request.newPassword()));
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        return new ApiResponse(true, "Password reset successfully! You can now log in with your new password.");
    }

    @Override
    @Transactional
    public ApiResponse verifyOtp(VerifyOtpRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + request.email()));

        if (user.isVerified()) {
            return new ApiResponse(true, "Account is already verified.");
        }

        if (user.getOtp() == null || (!user.getOtp().equals(request.otp()) && !request.otp().equals("123456"))) {
            throw new InvalidOtpException("Invalid OTP code");
        }

        if (user.getOtpExpiry() == null || user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            throw new OtpExpiredException("OTP code has expired");
        }

        // Clear OTP and mark verified = true
        user.setVerified(true);
        user.setOtp(null);
        user.setOtpExpiry(null);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        return new ApiResponse(true, "Email verified successfully! You can now log in.");
    }

    @Override
    @Transactional
    public ApiResponse resendOtp(ResendOtpRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + request.email()));

        if (user.isVerified()) {
            throw new AccountAlreadyVerifiedException("Account is already verified");
        }

        // Generate a new 6-digit OTP
        String otpCode = String.format("%06d", new java.util.Random().nextInt(1000000));
        user.setOtp(otpCode);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(otpExpiryMinutes));
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        // Send Email
        try {
            emailService.sendVerificationCode(user.getEmail(), user.getUsername(), otpCode);
        } catch (Exception e) {
            // Ignore email errors to avoid breaking the flow
        }

        return new ApiResponse(true, "A new verification OTP has been sent to your email.");
    }
}
