package com.medimart.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {
    @JsonProperty("oId")
    private Integer oId;
    
    @JsonProperty("oDate")
    private LocalDate oDate;
    
    @JsonProperty("oAddress")
    private String oAddress;
    
    @JsonProperty("oStatus")
    private String oStatus;
    
    @JsonProperty("oAmt")
    private Integer oAmt;
    
    @JsonProperty("cId")
    private Integer cId;
    
    @JsonProperty("cFullname")
    private String cFullname;
    
    private List<OrderItemDTO> items;
}
