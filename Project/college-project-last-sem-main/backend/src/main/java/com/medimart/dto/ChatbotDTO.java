package com.medimart.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ChatbotDTO {
    private Integer chatId;
    private Integer cId;
    private String cFullname;
    private String question;
    private String response;
}
