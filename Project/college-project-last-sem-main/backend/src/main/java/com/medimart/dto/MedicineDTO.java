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
public class MedicineDTO {
    @JsonProperty("mId")
    private Integer mId;
    
    @JsonProperty("mName")
    private String mName;
    
    @JsonProperty("mImage")
    private String mImage;
    
    @JsonProperty("mPrice")
    private Integer mPrice;
    
    @JsonProperty("mUnit")
    private Integer mUnit;
    
    @JsonProperty("mCategory")
    private String mCategory;
}
