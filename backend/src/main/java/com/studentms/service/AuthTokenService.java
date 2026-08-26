package com.studentms.service;

import com.studentms.dto.TokenRefreshRequest;
import com.studentms.dto.TokenRefreshResponse;
import com.studentms.dto.ForgotPasswordRequest;
import com.studentms.dto.ResetPasswordRequest;

public interface AuthTokenService {
    TokenRefreshResponse refreshToken(TokenRefreshRequest request);
    void forgotPassword(ForgotPasswordRequest request);
    void resetPassword(ResetPasswordRequest request);
}
