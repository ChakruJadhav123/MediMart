package com.medimart.controller;

import com.medimart.dto.JwtResponse;
import com.medimart.dto.LoginRequest;
import com.medimart.dto.RegisterRequest;
import com.medimart.dto.RegistrationOtpRequest;
import com.medimart.dto.VerifyRegistrationRequest;
import com.medimart.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        JwtResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    @PostMapping("/register/send-otp")
    public ResponseEntity<?> sendRegistrationOtp(@RequestBody RegistrationOtpRequest request) {
        return ResponseEntity.ok(authService.sendRegistrationOtp(request));
    }

    @PostMapping("/register/verify")
    public ResponseEntity<?> verifyRegistrationOtp(@RequestBody VerifyRegistrationRequest request) {
        return ResponseEntity.ok(authService.verifyOtpAndRegister(request));
    }
}
