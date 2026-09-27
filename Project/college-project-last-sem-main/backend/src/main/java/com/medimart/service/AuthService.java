package com.medimart.service;

import com.medimart.dto.ApiResponse;
import com.medimart.dto.CustomerDTO;
import com.medimart.dto.JwtResponse;
import com.medimart.dto.LoginRequest;
import com.medimart.dto.RegisterRequest;
import com.medimart.dto.RegistrationOtpRequest;
import com.medimart.dto.VerifyRegistrationRequest;
import com.medimart.entity.Admin;
import com.medimart.entity.Customer;
import com.medimart.repository.AdminRepository;
import com.medimart.repository.CustomerRepository;
import com.medimart.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final CustomerRepository customerRepository;
    private final AdminRepository adminRepository;
    private final CustomerService customerService;
    private final JwtUtils jwtUtils;
    private final OtpService otpService;

    public JwtResponse login(LoginRequest loginRequest) {
        String identifier = normalizeIdentifier(loginRequest.getLoginId());
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(identifier, loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        Optional<Admin> adminOpt = adminRepository.findAdminByLoginId(identifier);
        if (adminOpt.isEmpty()) adminOpt = adminRepository.findAdminByEmail(identifier);
        
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            return JwtResponse.builder()
                    .token(jwt)
                    .id(admin.getId())
                    .loginId(admin.getALoginId())
                    .fullName(admin.getAFullname())
                    .role("ADMIN")
                    .build();
        }

        Customer customer = customerRepository.findCustomerByLoginId(identifier)
                .orElseGet(() -> customerRepository.findCustomerByEmail(identifier)
                .orElseThrow(() -> new RuntimeException("Error: User not found.")));

        return JwtResponse.builder()
                .token(jwt)
                .id(customer.getId())
                .loginId(customer.getCLoginId())
                .fullName(customer.getCFullname())
                .role("USER")
                .build();
    }

    public CustomerDTO register(RegisterRequest registerRequest) {
        return customerService.register(registerRequest);
    }

    public ApiResponse<Object> sendRegistrationOtp(RegistrationOtpRequest request) {
        request.setCLoginId(normalizeIdentifier(request.getCLoginId()));
        request.setCEmail(normalizeEmail(request.getCEmail()));

        if (request.getCLoginId() == null || request.getCLoginId().isBlank()) {
            throw new RuntimeException("Login ID is required");
        }
        if (request.getCEmail() == null || request.getCEmail().isBlank()) {
            throw new RuntimeException("Email is required");
        }
        if (customerRepository.existsCustomerByLoginId(request.getCLoginId())) {
            throw new RuntimeException("Error: Login ID is already taken!");
        }
        if (customerRepository.existsCustomerByEmail(request.getCEmail())) {
            throw new RuntimeException("Error: Email is already registered!");
        }

        otpService.sendRegistrationOtp(request.getCEmail());
        return ApiResponse.success(null, "OTP sent to your email");
    }

    public CustomerDTO verifyOtpAndRegister(VerifyRegistrationRequest request) {
        request.setCEmail(normalizeEmail(request.getCEmail()));
        otpService.verifyRegistrationOtp(request.getCEmail(), request.getOtp());
        return customerService.register(request);
    }

    private String normalizeIdentifier(String identifier) {
        if (identifier == null) return null;
        String trimmed = identifier.trim();
        return trimmed.contains("@") ? trimmed.toLowerCase() : trimmed;
    }

    private String normalizeEmail(String email) {
        return email == null ? null : email.trim().toLowerCase();
    }
}
