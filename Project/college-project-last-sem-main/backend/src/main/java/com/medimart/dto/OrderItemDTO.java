package com.medimart.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemDTO {
    @JsonProperty("mId")
    private Integer mId;
    
    @JsonProperty("mName")
    private String mName;
    
    private Integer quantity;
    private Integer price;
}
