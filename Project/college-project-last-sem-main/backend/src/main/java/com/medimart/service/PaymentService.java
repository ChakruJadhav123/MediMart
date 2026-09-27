package com.medimart.service;

import com.medimart.dto.PaymentDTO;
import com.medimart.dto.PaymentQrRequest;
import com.medimart.dto.PaymentQrResponse;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.medimart.entity.Customer;
import com.medimart.entity.Payment;
import com.medimart.repository.CustomerRepository;
import com.medimart.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final CustomerRepository customerRepository;

    public List<PaymentDTO> getMyPayments(String loginId) {
        Customer customer = customerRepository.findCustomerByLoginId(loginId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        return paymentRepository.findPaymentsByCustomerId(customer.getId())
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<PaymentDTO> getAllPayments() {
        return paymentRepository.findAllPaymentsSorted().stream()
                .map(this::toDTO).collect(Collectors.toList());
    }

    public PaymentDTO updatePaymentStatus(Integer pId, String status) {
        Payment payment = paymentRepository.findById(pId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        payment.setPStatus(status);
        return toDTO(paymentRepository.save(payment));
    }

    public PaymentQrResponse generateQr(String loginId, PaymentQrRequest request) {
        Customer customer = customerRepository.findCustomerByLoginId(loginId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        int amount = request.getAmount() == null ? 0 : request.getAmount();
        if (amount <= 0) {
            throw new RuntimeException("Payment amount must be greater than zero");
        }

        String transactionRef = "MEDI-" + Instant.now().toEpochMilli() + "-" + UUID.randomUUID().toString().substring(0, 8);
        String note = "MediMart order for " + customer.getCLoginId();
        String payload = "upi://pay"
                + "?pa=" + encode("medimart@upi")
                + "&pn=" + encode("MediMart")
                + "&am=" + encode(String.format("%.2f", amount / 100.0))
                + "&cu=INR"
                + "&tn=" + encode(note)
                + "&tr=" + encode(transactionRef);

        return PaymentQrResponse.builder()
                .transactionRef(transactionRef)
                .qrPayload(payload)
                .qrImage(toQrDataUri(payload))
                .amount(amount)
                .build();
    }

    private String toQrDataUri(String payload) {
        try {
            QRCodeWriter writer = new QRCodeWriter();
            BitMatrix matrix = writer.encode(payload, BarcodeFormat.QR_CODE, 280, 280);
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(matrix, "PNG", outputStream);
            return "data:image/png;base64," + Base64.getEncoder().encodeToString(outputStream.toByteArray());
        } catch (Exception ex) {
            throw new RuntimeException("Unable to generate payment QR code", ex);
        }
    }

    private String encode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }

    private PaymentDTO toDTO(Payment p) {
        return PaymentDTO.builder()
                .pId(p.getId())
                .pMethod(p.getPMethod())
                .pDate(p.getPDate())
                .pAmount(p.getPAmount())
                .pStatus(p.getPStatus())
                .oId(p.getOrder() != null ? p.getOrder().getId() : null)
                .build();
    }
}
