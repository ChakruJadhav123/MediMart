package com.medimart.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "orders_seq")
    @SequenceGenerator(name = "orders_seq", sequenceName = "orders_seq", allocationSize = 1)
    @Column(name = "o_id")
    private Integer id;

    @Column(name = "o_date", nullable = false)
    private LocalDate oDate;

    @Column(name = "o_address", length = 50, nullable = false)
    private String oAddress;

    @Column(name = "o_status", length = 10)
    @Builder.Default
    private String oStatus = "PENDING";

    @Column(name = "o_amt", nullable = false)
    private Integer oAmt;

    @ManyToOne
    @JoinColumn(name = "c_id", nullable = false)
    private Customer customer;
}
