package com.medimart.controller;

import com.medimart.dto.ProfileDTO;
import com.medimart.service.AdminService;
import com.medimart.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final CustomerService customerService;
    private final AdminService adminService;

    @GetMapping
    public ResponseEntity<ProfileDTO> getProfile(Authentication auth) {
        String loginId = auth.getName();
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (isAdmin) {
            return ResponseEntity.ok(adminService.getUnifiedProfile(loginId));
        } else {
            return ResponseEntity.ok(customerService.getUnifiedProfile(loginId));
        }
    }

    @PutMapping
    public ResponseEntity<ProfileDTO> updateProfile(Authentication auth, @RequestBody ProfileDTO request) {
        String loginId = auth.getName();
        System.out.println("Updating profile for: " + loginId + " with data: " + request);
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (isAdmin) {
            return ResponseEntity.ok(adminService.updateUnifiedProfile(loginId, request));
        } else {
            return ResponseEntity.ok(customerService.updateUnifiedProfile(loginId, request));
        }
    }
}
