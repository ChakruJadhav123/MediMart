package com.medimart.dto;

import lombok.Data;

@Data
public class CreateMedicineRequest {
    private String mName;
    private String mImage;
    private Integer mPrice;
    private Integer mUnit;
    private String mCategory;
}
