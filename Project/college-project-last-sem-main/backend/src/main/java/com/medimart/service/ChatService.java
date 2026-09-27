package com.medimart.service;

import com.medimart.dto.ChatbotDTO;
import com.medimart.entity.Chatbot;
import com.medimart.entity.Customer;
import com.medimart.repository.ChatbotRepository;
import com.medimart.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatbotRepository chatbotRepository;
    private final CustomerRepository customerRepository;
    private final com.medimart.repository.SystemSettingRepository systemSettingRepository;

    public boolean isChatbotEnabled() {
        return systemSettingRepository.findById("CHATBOT_ENABLED")
                .map(s -> "true".equals(s.getValue()))
                .orElse(true); // Default to enabled
    }

    public void setChatbotEnabled(boolean enabled) {
        systemSettingRepository.save(new com.medimart.entity.SystemSetting("CHATBOT_ENABLED", String.valueOf(enabled)));
    }

    public String getResponse(String question, String loginId) {
        Customer customer = null;
        if (loginId != null && !loginId.equals("anonymousUser")) {
            customer = customerRepository.findCustomerByLoginId(loginId).orElse(null);
        }

        if (!isChatbotEnabled()) {
            return "Chatbot is currently disabled by the administrator.";
        }

        String response = computeResponse(question);

        String truncatedQuestion = question.length() > 500 ? question.substring(0, 500) : question;
        String truncatedResponse = response.length() > 500 ? response.substring(0, 500) : response;

        Chatbot chatbot = Chatbot.builder()
                .customer(customer)
                .question(truncatedQuestion)
                .response(truncatedResponse)
                .build();
        chatbotRepository.save(chatbot);

        return response;
    }

    private String computeResponse(String question) {
        String q = question.toLowerCase();
        if (q.contains("order") || q.contains("status")) {
            return "You can check your order status in the 'Orders' section of your profile.";
        } else if (q.contains("payment") || q.contains("refund")) {
            return "For payment issues or refunds, please contact our support at support@medimart.com.";
        } else if (q.contains("prescription") || q.contains("doctor")) {
            return "We require a valid prescription for certain medicines. You can consult a doctor on our platform.";
        } else if (q.contains("delivery") || q.contains("shipping")) {
            return "Delivery typically takes 2-3 business days. Free delivery on orders over ₹499.";
        } else {
            return "I am a simple virtual assistant. Could you rephrase your question or contact support?";
        }
    }

    public List<ChatbotDTO> getMyChatHistory(String loginId) {
        Customer customer = customerRepository.findCustomerByLoginId(loginId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        return chatbotRepository.findChatHistoryByCustomerId(customer.getId())
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<ChatbotDTO> getAllChatHistory() {
        return chatbotRepository.findAllChatHistorySorted().stream()
                .map(this::toDTO).collect(Collectors.toList());
    }

    private ChatbotDTO toDTO(Chatbot c) {
        return ChatbotDTO.builder()
                .chatId(c.getId())
                .cId(c.getCustomer() != null ? c.getCustomer().getId() : null)
                .cFullname(c.getCustomer() != null ? c.getCustomer().getCFullname() : null)
                .question(c.getQuestion())
                .response(c.getResponse())
                .build();
    }
}
