package com.medimart.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class VerifyRegistrationRequest extends RegisterRequest {
    @JsonProperty("otp")
    private String otp;
}
