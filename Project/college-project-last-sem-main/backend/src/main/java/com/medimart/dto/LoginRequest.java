package com.medimart.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.Data;

@Data
public class LoginRequest {
    @JsonAlias({"email", "gmail", "gmailId"})
    private String loginId;

    private String password;
}
