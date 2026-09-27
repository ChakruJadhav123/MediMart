package com.medimart.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class OtpService {

    private static final int OTP_MINUTES = 10;
    private final ObjectProvider<JavaMailSender> mailSenderProvider;
    private final SecureRandom secureRandom = new SecureRandom();
    private final Map<String, OtpEntry> otpStore = new ConcurrentHashMap<>();

    @Value("${spring.mail.username:}")
    private String fromEmail;

    public void sendRegistrationOtp(String email) {
        if (email == null || email.isBlank()) {
            throw new RuntimeException("Email is required for OTP verification");
        }

        String otp = String.format("%06d", secureRandom.nextInt(1_000_000));
        otpStore.put(normalize(email), new OtpEntry(otp, LocalDateTime.now().plusMinutes(OTP_MINUTES)));

        JavaMailSender mailSender = mailSenderProvider.getIfAvailable();
        if (mailSender == null || fromEmail == null || fromEmail.isBlank()) {
            throw new RuntimeException("Email is not configured. Set MAIL_USERNAME and MAIL_APP_PASSWORD for Gmail SMTP.");
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(email);
        message.setSubject("MediMart registration OTP");
        message.setText("Your MediMart registration OTP is " + otp + ". It expires in " + OTP_MINUTES + " minutes.");
        mailSender.send(message);
    }

    public void verifyRegistrationOtp(String email, String otp) {
        OtpEntry entry = otpStore.get(normalize(email));
        if (entry == null) {
            throw new RuntimeException("OTP not found. Please request a new OTP.");
        }
        if (entry.expiresAt().isBefore(LocalDateTime.now())) {
            otpStore.remove(normalize(email));
            throw new RuntimeException("OTP expired. Please request a new OTP.");
        }
        if (otp == null || !entry.otp().equals(otp.trim())) {
            throw new RuntimeException("Invalid OTP");
        }
        otpStore.remove(normalize(email));
    }

    private String normalize(String email) {
        return email == null ? "" : email.trim().toLowerCase();
    }

    private record OtpEntry(String otp, LocalDateTime expiresAt) {}
}
