package com.medimart.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class RegisterRequest {
    @JsonProperty("cFullname")
    @JsonAlias({"fullName", "fullname", "name"})
    private String cFullname;
    
    @JsonProperty("cLoginId")
    @JsonAlias({"loginId", "username", "userName"})
    private String cLoginId;
    
    @JsonProperty("cPassword")
    @JsonAlias({"password"})
    private String cPassword;
    
    @JsonProperty("cContact")
    @JsonAlias({"contact", "phone", "phoneNumber", "mobile"})
    private String cContact;
    
    @JsonProperty("cEmail")
    @JsonAlias({"email", "gmail", "gmailId"})
    private String cEmail;
    
    @JsonProperty("cAddress")
    @JsonAlias({"address"})
    private String cAddress;
    
    @JsonProperty("cGender")
    @JsonAlias({"gender"})
    private String cGender;
}
