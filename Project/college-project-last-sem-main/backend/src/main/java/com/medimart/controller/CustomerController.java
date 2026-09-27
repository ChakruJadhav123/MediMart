package com.medimart.controller;

import com.medimart.dto.CustomerDTO;
import com.medimart.dto.RegisterRequest;
import com.medimart.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    @GetMapping("/customer/profile")
    public ResponseEntity<CustomerDTO> getProfile(Authentication auth) {
        return ResponseEntity.ok(customerService.getProfile(auth.getName()));
    }

    @PutMapping("/customer/profile")
    public ResponseEntity<CustomerDTO> updateProfile(Authentication auth, @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(customerService.updateProfile(auth.getName(), request));
    }

    @GetMapping("/admin/customers")
    public ResponseEntity<List<CustomerDTO>> getAllCustomers() {
        return ResponseEntity.ok(customerService.getAllCustomers());
    }

    @DeleteMapping("/admin/customers/{id}")
    public ResponseEntity<?> deleteCustomer(@PathVariable Integer id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/admin/customers")
    public ResponseEntity<CustomerDTO> createCustomer(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(customerService.register(request));
    }

    @PutMapping("/admin/customers/{id}")
    public ResponseEntity<CustomerDTO> updateCustomer(@PathVariable Integer id, @RequestBody RegisterRequest request) {
        // Find by ID and update
        CustomerDTO profile = customerService.getProfileById(id);
        return ResponseEntity.ok(customerService.updateProfile(profile.getCLoginId(), request));
    }
}
