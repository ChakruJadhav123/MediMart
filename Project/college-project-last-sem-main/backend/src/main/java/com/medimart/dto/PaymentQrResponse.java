package com.medimart.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentQrResponse {
    private String transactionRef;
    private String qrPayload;
    private String qrImage;
    private Integer amount;
}
