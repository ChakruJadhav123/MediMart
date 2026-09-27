package com.medimart.dto;

import lombok.Data;

@Data
public class PaymentQrRequest {
    private Integer amount;
    private String paymentMethod;
}
