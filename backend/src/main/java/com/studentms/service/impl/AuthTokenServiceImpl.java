package com.studentms.service.impl;

import com.studentms.dto.ForgotPasswordRequest;
import com.studentms.dto.ResetPasswordRequest;
import com.studentms.dto.TokenRefreshRequest;
import com.studentms.dto.TokenRefreshResponse;
import com.studentms.entity.PasswordResetToken;
import com.studentms.entity.RefreshToken;
import com.studentms.entity.User;
import com.studentms.exception.ResourceNotFoundException;
import com.studentms.exception.TokenRefreshException;
import com.studentms.repository.PasswordResetTokenRepository;
import com.studentms.repository.RefreshTokenRepository;
import com.studentms.repository.UserRepository;
import com.studentms.security.EmailService;
import com.studentms.security.JwtTokenProvider;
import com.studentms.service.AuthTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthTokenServiceImpl implements AuthTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Override
    public TokenRefreshResponse refreshToken(TokenRefreshRequest request) {
        RefreshToken token = refreshTokenRepository.findByToken(request.getRefreshToken())
                .orElseThrow(() -> new TokenRefreshException("Refresh token not found"));

        if (token.isRevoked() || token.getExpiryDate().isBefore(Instant.now())) {
            throw new TokenRefreshException("Refresh token is invalid or expired");
        }

        String username = token.getUser().getUsername();
        String accessToken = jwtTokenProvider.generateTokenWithUsername(username);
        String refreshToken = jwtTokenProvider.generateRefreshToken(username);

        token.setToken(refreshToken);
        token.setExpiryDate(Instant.now().plus(30, ChronoUnit.DAYS));
        refreshTokenRepository.save(token);

        return new TokenRefreshResponse(accessToken, refreshToken);
    }

    @Override
    public void forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.getEmail()));

        passwordResetTokenRepository.deleteByUser(user);

        String resetToken = UUID.randomUUID().toString();
        PasswordResetToken token = PasswordResetToken.builder()
                .token(resetToken)
                .user(user)
                .expiryDate(Instant.now().plus(1, ChronoUnit.HOURS))
                .used(false)
                .createdAt(Instant.now())
                .build();

        passwordResetTokenRepository.save(token);
        emailService.sendPasswordResetEmail(user.getEmail(), resetToken);
    }

    @Override
    public void resetPassword(ResetPasswordRequest request) {
        PasswordResetToken token = passwordResetTokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new ResourceNotFoundException("Reset token not found"));

        if (token.isUsed() || token.getExpiryDate().isBefore(Instant.now())) {
            throw new TokenRefreshException("Reset token is invalid or expired");
        }

        User user = token.getUser();
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        token.setUsed(true);
        passwordResetTokenRepository.save(token);
    }
}
