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
public class CustomerDTO {
    @JsonProperty("cId")
    private Integer cId;
    
    @JsonProperty("cFullname")
    private String cFullname;
    
    @JsonProperty("cLoginId")
    private String cLoginId;
    
    @JsonProperty("cEmail")
    private String cEmail;
    
    @JsonProperty("cContact")
    private String cContact;
    
    @JsonProperty("cAddress")
    private String cAddress;
    
    @JsonProperty("cGender")
    private String cGender;
}
