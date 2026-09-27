package com.medimart.controller;

import com.medimart.dto.AdminDTO;
import com.medimart.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/profile")
@RequiredArgsConstructor
public class AdminProfileController {

    private final AdminService adminService;

    @GetMapping
    public ResponseEntity<AdminDTO> getAdminProfile(Authentication auth) {
        return ResponseEntity.ok(adminService.getProfile(auth.getName()));
    }

    @PutMapping
    public ResponseEntity<AdminDTO> updateAdminProfile(Authentication auth, @RequestBody AdminDTO request) {
        return ResponseEntity.ok(adminService.updateProfile(auth.getName(), request));
    }
}
