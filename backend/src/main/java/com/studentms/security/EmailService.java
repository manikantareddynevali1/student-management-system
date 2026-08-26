package com.studentms.security;

public interface EmailService {
    void sendPasswordResetEmail(String email, String resetToken);
}
