package com.medimart.controller;

import com.medimart.dto.ChatbotDTO;
import com.medimart.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/chat")
    public ResponseEntity<?> getResponse(@RequestBody Map<String, String> request, Authentication auth) {
        String question = request.get("message");
        String loginId = auth != null ? auth.getName() : null;
        String response = chatService.getResponse(question, loginId);
        return ResponseEntity.ok(Map.of("response", response));
    }

    @GetMapping("/chat/history")
    public ResponseEntity<List<ChatbotDTO>> getMyChatHistory(Authentication auth) {
        return ResponseEntity.ok(chatService.getMyChatHistory(auth.getName()));
    }

    @GetMapping("/admin/chat")
    public ResponseEntity<List<ChatbotDTO>> getAllChatHistory() {
        return ResponseEntity.ok(chatService.getAllChatHistory());
    }

    @GetMapping("/chat/status")
    public ResponseEntity<?> getChatbotStatus() {
        return ResponseEntity.ok(Map.of("enabled", chatService.isChatbotEnabled()));
    }

    @PostMapping("/admin/chat/status")
    public ResponseEntity<?> setChatbotStatus(@RequestBody Map<String, Boolean> request) {
        chatService.setChatbotEnabled(request.get("enabled"));
        return ResponseEntity.ok(Map.of("message", "Chatbot status updated"));
    }
}
