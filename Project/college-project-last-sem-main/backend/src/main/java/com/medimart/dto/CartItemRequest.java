package com.medimart.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class CartItemRequest {
    @JsonProperty("mId")
    private Integer mId;
    
    private Integer quantity;
}
