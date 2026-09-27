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
public class AdminDTO {
    @JsonProperty("aId")
    private Integer aId;
    
    @JsonProperty("aFullname")
    private String aFullname;
    
    @JsonProperty("aLoginId")
    private String aLoginId;
    
    @JsonProperty("aEmail")
    private String aEmail;
    
    @JsonProperty("aContact")
    private String aContact;
    
    @JsonProperty("aAddress")
    private String aAddress;
    
    @JsonProperty("aGender")
    private String aGender;
}
