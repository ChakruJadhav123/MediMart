package com.medimart.controller;

import com.medimart.repository.CustomerRepository;
import com.medimart.repository.MedicineRepository;
import com.medimart.repository.OrderRepository;
import com.medimart.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
public class AdminController {

    private final CustomerRepository customerRepository;
    private final MedicineRepository medicineRepository;
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getDashboardData() {
        Map<String, Object> data = new HashMap<>();
        data.put("totalCustomers", customerRepository.count());
        data.put("totalMedicines", medicineRepository.count());
        data.put("totalOrders", orderRepository.count());
        data.put("pendingOrders", orderRepository.countOrdersByStatus("PENDING"));

        long totalRevenue = paymentRepository.findAll().stream()
                .filter(p -> "PAID".equals(p.getPStatus()))
                .mapToLong(p -> p.getPAmount())
                .sum();
                
        data.put("totalRevenue", totalRevenue);
        return ResponseEntity.ok(data);
    }
}
