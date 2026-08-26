package com.studentms.service.impl;

import com.studentms.dto.AuthRequest;
import com.studentms.dto.AuthResponse;
import com.studentms.dto.RegisterRequest;
import com.studentms.entity.RefreshToken;
import com.studentms.entity.Role;
import com.studentms.entity.User;
import com.studentms.exception.ResourceNotFoundException;
import com.studentms.repository.RefreshTokenRepository;
import com.studentms.repository.RoleRepository;
import com.studentms.repository.UserRepository;
import com.studentms.security.JwtTokenProvider;
import com.studentms.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    @Transactional
    public AuthResponse authenticate(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String token = jwtTokenProvider.generateToken(authentication);
        String refreshToken = saveRefreshToken(user);

        return new AuthResponse(token, refreshToken);
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username is already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered");
        }

        Role role = roleRepository.findByName(request.getRole())
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .enabled(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        userRepository.save(user);

        String token = jwtTokenProvider.generateTokenWithUsername(user.getUsername());
        String refreshToken = saveRefreshToken(user);

        return new AuthResponse(token, refreshToken);
    }

    private String saveRefreshToken(User user) {
        refreshTokenRepository.deleteByUser(user);

        String token = jwtTokenProvider.generateRefreshToken(user.getUsername());
        RefreshToken refreshToken = RefreshToken.builder()
                .token(token)
                .user(user)
                .expiryDate(Instant.now().plus(30, ChronoUnit.DAYS))
                .revoked(false)
                .createdAt(Instant.now())
                .build();

        refreshTokenRepository.save(refreshToken);
        return token;
    }
}
