package com.medimart.service;

import com.medimart.dto.AdminDTO;
import com.medimart.dto.ProfileDTO;
import com.medimart.entity.Admin;
import com.medimart.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminService {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminDTO getProfile(String loginId) {
        Admin admin = adminRepository.findAdminByLoginId(loginId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
        return toDTO(admin);
    }
    
    public AdminDTO getProfileById(Integer id) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
        return toDTO(admin);
    }
    
    public AdminDTO createAdmin(com.medimart.dto.RegisterRequest request) {
        if (adminRepository.existsAdminByLoginId(request.getCLoginId())) {
            throw new RuntimeException("Error: Login ID is already taken!");
        }

        Admin admin = Admin.builder()
                .aFullname(request.getCFullname())
                .aLoginId(request.getCLoginId())
                .aPassword(passwordEncoder.encode(request.getCPassword()))
                .aContact(request.getCContact())
                .aEmail(request.getCEmail())
                .aAddress(request.getCAddress())
                .aGender(request.getCGender())
                .build();

        admin = adminRepository.save(admin);
        return toDTO(admin);
    }

    public AdminDTO updateProfile(String loginId, AdminDTO request) {
        Admin admin = adminRepository.findAdminByLoginId(loginId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if (request.getAFullname() != null) admin.setAFullname(request.getAFullname());
        if (request.getAContact() != null) admin.setAContact(request.getAContact());
        if (request.getAEmail() != null) admin.setAEmail(request.getAEmail());
        if (request.getAAddress() != null) admin.setAAddress(request.getAAddress());
        if (request.getAGender() != null) admin.setAGender(request.getAGender());
        
        // Also check if password needs update (if we map RegisterRequest here)
        // Since request is AdminDTO here, we'll leave password update logic to another method or handle it if AdminDTO had a password field.
        // Wait, AdminDTO does not have a password field. Let's create an overloaded updateProfile that takes RegisterRequest.

        admin = adminRepository.save(admin);
        return toDTO(admin);
    }
    
    public AdminDTO updateProfile(String loginId, com.medimart.dto.RegisterRequest request) {
        Admin admin = adminRepository.findAdminByLoginId(loginId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if (request.getCFullname() != null) admin.setAFullname(request.getCFullname());
        if (request.getCContact() != null) admin.setAContact(request.getCContact());
        if (request.getCEmail() != null) admin.setAEmail(request.getCEmail());
        if (request.getCAddress() != null) admin.setAAddress(request.getCAddress());
        if (request.getCGender() != null) admin.setAGender(request.getCGender());
        
        if (request.getCPassword() != null && !request.getCPassword().isEmpty()) {
            admin.setAPassword(passwordEncoder.encode(request.getCPassword()));
        }

        admin = adminRepository.save(admin);
        return toDTO(admin);
    }

    public ProfileDTO getUnifiedProfile(String loginId) {
        Admin a = adminRepository.findAdminByLoginId(loginId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
        return ProfileDTO.builder()
                .fullName(a.getAFullname())
                .email(a.getAEmail())
                .contact(a.getAContact())
                .address(a.getAAddress())
                .gender(a.getAGender())
                .loginId(a.getALoginId())
                .role("ADMIN")
                .build();
    }

    public ProfileDTO updateUnifiedProfile(String loginId, ProfileDTO request) {
        Admin a = adminRepository.findAdminByLoginId(loginId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if (request.getFullName() != null) a.setAFullname(request.getFullName());
        if (request.getContact() != null) a.setAContact(request.getContact());
        if (request.getEmail() != null) a.setAEmail(request.getEmail());
        if (request.getAddress() != null) a.setAAddress(request.getAddress());
        if (request.getGender() != null) a.setAGender(request.getGender());

        a = adminRepository.save(a);
        return getUnifiedProfile(a.getALoginId());
    }

    public List<AdminDTO> getAllAdmins() {
        return adminRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    public void deleteAdmin(Integer id) {
        adminRepository.deleteById(id);
    }

    private AdminDTO toDTO(Admin a) {
        return AdminDTO.builder()
                .aId(a.getId())
                .aFullname(a.getAFullname())
                .aLoginId(a.getALoginId())
                .aEmail(a.getAEmail())
                .aContact(a.getAContact())
                .aAddress(a.getAAddress())
                .aGender(a.getAGender())
                .build();
    }
}
