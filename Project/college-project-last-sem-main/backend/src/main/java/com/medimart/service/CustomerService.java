package com.medimart.service;

import com.medimart.dto.CustomerDTO;
import com.medimart.dto.ProfileDTO;
import com.medimart.dto.RegisterRequest;
import com.medimart.entity.Customer;
import com.medimart.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    public CustomerDTO register(RegisterRequest registerRequest) {
        normalizeRegisterRequest(registerRequest);
        validateRegisterRequest(registerRequest);

        if (customerRepository.existsCustomerByLoginId(registerRequest.getCLoginId())) {
            throw new RuntimeException("Error: Login ID is already taken!");
        }
        if (registerRequest.getCEmail() != null
                && !registerRequest.getCEmail().isBlank()
                && customerRepository.existsCustomerByEmail(registerRequest.getCEmail())) {
            throw new RuntimeException("Error: Email is already registered!");
        }

        Customer customer = Customer.builder()
                .cFullname(registerRequest.getCFullname())
                .cLoginId(registerRequest.getCLoginId())
                .cPassword(passwordEncoder.encode(registerRequest.getCPassword()))
                .cContact(registerRequest.getCContact())
                .cEmail(registerRequest.getCEmail())
                .cAddress(registerRequest.getCAddress())
                .cGender(registerRequest.getCGender())
                .build();

        customer = customerRepository.save(customer);

        return toDTO(customer);
    }

    public CustomerDTO getProfile(String loginId) {
        Customer customer = customerRepository.findCustomerByLoginId(loginId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        return toDTO(customer);
    }

    public CustomerDTO getProfileById(Integer id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        return toDTO(customer);
    }

    public CustomerDTO updateProfile(String loginId, RegisterRequest request) {
        Customer customer = customerRepository.findCustomerByLoginId(loginId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        if (request.getCFullname() != null) customer.setCFullname(request.getCFullname());
        if (request.getCContact() != null) customer.setCContact(request.getCContact());
        if (request.getCEmail() != null) customer.setCEmail(request.getCEmail());
        if (request.getCAddress() != null) customer.setCAddress(request.getCAddress());
        if (request.getCGender() != null) customer.setCGender(request.getCGender());
        
        if (request.getCPassword() != null && !request.getCPassword().isEmpty()) {
            customer.setCPassword(passwordEncoder.encode(request.getCPassword()));
        }

        customer = customerRepository.save(customer);
        return toDTO(customer);
    }

    public List<CustomerDTO> getAllCustomers() {
        return customerRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public ProfileDTO getUnifiedProfile(String loginId) {
        Customer c = customerRepository.findCustomerByLoginId(loginId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        return ProfileDTO.builder()
                .fullName(c.getCFullname())
                .email(c.getCEmail())
                .contact(c.getCContact())
                .address(c.getCAddress())
                .gender(c.getCGender())
                .loginId(c.getCLoginId())
                .role("USER")
                .build();
    }

    public ProfileDTO updateUnifiedProfile(String loginId, ProfileDTO request) {
        Customer c = customerRepository.findCustomerByLoginId(loginId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        System.out.println("DEBUG: Updating customer " + loginId + " with " + request);

        if (request.getFullName() != null) c.setCFullname(request.getFullName());
        if (request.getContact() != null) c.setCContact(request.getContact());
        if (request.getEmail() != null) c.setCEmail(request.getEmail());
        if (request.getAddress() != null) c.setCAddress(request.getAddress());
        if (request.getGender() != null) c.setCGender(request.getGender());

        c = customerRepository.save(c);
        return getUnifiedProfile(c.getCLoginId());
    }

    public void deleteCustomer(Integer id) {
        customerRepository.deleteById(id);
    }

    private CustomerDTO toDTO(Customer c) {
        return CustomerDTO.builder()
                .cId(c.getId())
                .cFullname(c.getCFullname())
                .cLoginId(c.getCLoginId())
                .cEmail(c.getCEmail())
                .cContact(c.getCContact())
                .cAddress(c.getCAddress())
                .cGender(c.getCGender())
                .build();
    }

    private void normalizeRegisterRequest(RegisterRequest request) {
        if (request.getCFullname() != null) request.setCFullname(request.getCFullname().trim());
        if (request.getCLoginId() != null) request.setCLoginId(request.getCLoginId().trim().toLowerCase());
        if (request.getCEmail() != null) request.setCEmail(request.getCEmail().trim().toLowerCase());
        if (request.getCContact() != null) request.setCContact(request.getCContact().trim());
        if (request.getCAddress() != null) request.setCAddress(request.getCAddress().trim());
        if (request.getCGender() != null) request.setCGender(request.getCGender().trim());

        if ((request.getCLoginId() == null || request.getCLoginId().isBlank())
                && request.getCEmail() != null
                && !request.getCEmail().isBlank()) {
            request.setCLoginId(generateLoginIdFromEmail(request.getCEmail()));
        }
    }

    private void validateRegisterRequest(RegisterRequest request) {
        if (request.getCFullname() == null || request.getCFullname().isBlank()) {
            throw new RuntimeException("Full name is required");
        }
        if (request.getCLoginId() == null || request.getCLoginId().isBlank()) {
            throw new RuntimeException("Login ID is required");
        }
        if (request.getCPassword() == null || request.getCPassword().isBlank()) {
            throw new RuntimeException("Password is required");
        }
        if (request.getCEmail() == null || request.getCEmail().isBlank()) {
            throw new RuntimeException("Email is required");
        }
        if (request.getCPassword().length() < 6) {
            throw new RuntimeException("Password must be at least 6 characters");
        }
    }

    private String generateLoginIdFromEmail(String email) {
        String base = email.split("@", 2)[0].replaceAll("[^a-z0-9]", "");
        if (base.isBlank()) base = "user";
        if (base.length() > 8) base = base.substring(0, 8);

        String loginId = base;
        int suffix = 1;
        while (customerRepository.existsCustomerByLoginId(loginId)) {
            String suffixText = String.valueOf(suffix++);
            int prefixLength = Math.min(base.length(), 10 - suffixText.length());
            loginId = base.substring(0, prefixLength) + suffixText;
        }
        return loginId;
    }
}
