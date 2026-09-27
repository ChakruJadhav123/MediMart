package com.medimart.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDTO {
    @JsonProperty("pId")
    private Integer pId;
    
    @JsonProperty("pMethod")
    private String pMethod;
    
    @JsonProperty("pDate")
    private LocalDate pDate;
    
    @JsonProperty("pAmount")
    private Integer pAmount;
    
    @JsonProperty("pStatus")
    private String pStatus;
    
    @JsonProperty("oId")
    private Integer oId;
}
