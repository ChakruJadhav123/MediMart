package com.medimart.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class RegistrationOtpRequest {
    @JsonProperty("cLoginId")
    @JsonAlias({"loginId", "username", "userName"})
    private String cLoginId;

    @JsonProperty("cEmail")
    @JsonAlias({"email", "gmail", "gmailId"})
    private String cEmail;
}
