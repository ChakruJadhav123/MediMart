package com.medimart.repository;

import com.medimart.entity.Chatbot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface ChatbotRepository extends JpaRepository<Chatbot, Integer> {
    @Query("SELECT c FROM Chatbot c WHERE c.customer.id = :id ORDER BY c.id DESC")
    List<Chatbot> findChatHistoryByCustomerId(@Param("id") Integer id);

    @Query("SELECT c FROM Chatbot c ORDER BY c.id DESC")
    List<Chatbot> findAllChatHistorySorted();
}
