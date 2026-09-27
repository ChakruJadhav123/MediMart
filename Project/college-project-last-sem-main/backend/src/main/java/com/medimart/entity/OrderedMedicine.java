package com.medimart.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ordered_medicine")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderedMedicine {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "ordered_medicine_seq")
    @SequenceGenerator(name = "ordered_medicine_seq", sequenceName = "ordered_medicine_seq", allocationSize = 1)
    @Column(name = "om_id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "o_id", nullable = false)
    private Order order;

    @ManyToOne
    @JoinColumn(name = "m_id", nullable = false)
    private Medicine medicine;

    @Column(name = "om_quantity", nullable = false)
    private Integer quantity;

    @Column(name = "om_price", nullable = false)
    private Integer priceAtOrder;
}
