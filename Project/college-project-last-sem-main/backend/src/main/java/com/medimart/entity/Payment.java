package com.medimart.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "payment")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "payment_seq")
    @SequenceGenerator(name = "payment_seq", sequenceName = "payment_seq", allocationSize = 1)
    @Column(name = "p_id")
    private Integer id;

    @Column(name = "p_method", length = 20, nullable = false)
    private String pMethod;

    @Column(name = "p_date", nullable = false)
    private LocalDate pDate;

    @Column(name = "p_amount", nullable = false)
    private Integer pAmount;

    @Column(name = "p_status", length = 10)
    @Builder.Default
    private String pStatus = "PENDING";

    @OneToOne
    @JoinColumn(name = "o_id", unique = true, nullable = false)
    private Order order;

    @PrePersist
    protected void onCreate() {
        if (pDate == null) {
            pDate = LocalDate.now();
        }
    }
}
