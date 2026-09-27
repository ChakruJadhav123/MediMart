package com.medimart.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "chatbot")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Chatbot {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "chatbot_seq")
    @SequenceGenerator(name = "chatbot_seq", sequenceName = "chatbot_seq", allocationSize = 1)
    @Column(name = "chat_id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "c_id")
    private Customer customer;

    @Column(name = "question", length = 500, nullable = false)
    private String question;

    @Column(name = "response", length = 500, nullable = false)
    private String response;
}
