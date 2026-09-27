package com.medimart.security;

import com.medimart.entity.Admin;
import com.medimart.entity.Customer;
import com.medimart.repository.AdminRepository;
import com.medimart.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final AdminRepository adminRepository;
    private final CustomerRepository customerRepository;

    @Override
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
        // Try Admin by Login ID or Email
        Optional<Admin> adminOpt = adminRepository.findAdminByLoginId(identifier);
        if (adminOpt.isEmpty()) {
            adminOpt = adminRepository.findAdminByEmail(identifier);
        }
        
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            return new org.springframework.security.core.userdetails.User(
                    admin.getALoginId(),
                    admin.getAPassword(),
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN"))
            );
        }

        // Try Customer by Login ID or Email
        Optional<Customer> customerOpt = customerRepository.findCustomerByLoginId(identifier);
        if (customerOpt.isEmpty()) {
            customerOpt = customerRepository.findCustomerByEmail(identifier);
        }
        
        if (customerOpt.isPresent()) {
            Customer customer = customerOpt.get();
            return new org.springframework.security.core.userdetails.User(
                    customer.getCLoginId(),
                    customer.getCPassword(),
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
            );
        }

        throw new UsernameNotFoundException("User not found with identifier: " + identifier);
    }
}
