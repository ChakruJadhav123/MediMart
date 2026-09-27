package com.medimart.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.List;

@Data
public class PlaceOrderRequest {
    @JsonProperty("oAddress")
    private String oAddress;
    
    @JsonProperty("paymentMethod")
    private String paymentMethod;
    
    private List<CartItemRequest> items;
}
