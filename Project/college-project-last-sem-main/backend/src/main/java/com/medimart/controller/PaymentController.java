package com.medimart.controller;

import com.medimart.dto.PaymentDTO;
import com.medimart.dto.PaymentQrRequest;
import com.medimart.dto.PaymentQrResponse;
import com.medimart.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @GetMapping("/payments/my-payments")
    public ResponseEntity<List<PaymentDTO>> getMyPayments(Authentication auth) {
        return ResponseEntity.ok(paymentService.getMyPayments(auth.getName()));
    }

    @PostMapping("/payments/qr")
    public ResponseEntity<PaymentQrResponse> generatePaymentQr(Authentication auth, @RequestBody PaymentQrRequest request) {
        return ResponseEntity.ok(paymentService.generateQr(auth.getName(), request));
    }

    @GetMapping("/admin/payments")
    public ResponseEntity<List<PaymentDTO>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    @PutMapping("/admin/payments/{id}/status")
    public ResponseEntity<PaymentDTO> updatePaymentStatus(@PathVariable Integer id, @RequestParam String status) {
        return ResponseEntity.ok(paymentService.updatePaymentStatus(id, status));
    }
}
