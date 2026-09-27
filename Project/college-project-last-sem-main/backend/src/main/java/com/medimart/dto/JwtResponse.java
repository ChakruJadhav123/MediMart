package com.medimart.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class JwtResponse {
    private String token;
    @Builder.Default
    private String type = "Bearer";
    private Integer id;
    private String loginId;
    private String fullName;
    private String role;
}
