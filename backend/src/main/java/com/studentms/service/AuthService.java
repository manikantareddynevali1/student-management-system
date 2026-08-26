package com.studentms.service;

import com.studentms.dto.AuthRequest;
import com.studentms.dto.AuthResponse;
import com.studentms.dto.RegisterRequest;

public interface AuthService {
    AuthResponse authenticate(AuthRequest request);
    AuthResponse register(RegisterRequest request);
}
