package com.medimart.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "medicine")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Medicine {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "medicine_seq")
    @SequenceGenerator(name = "medicine_seq", sequenceName = "medicine_seq", allocationSize = 1)
    @Column(name = "m_id")
    private Integer id;

    @Column(name = "m_name", length = 20, nullable = false)
    private String mName;

    @Column(name = "m_image", length = 255)
    private String mImage;

    @Column(name = "m_price", nullable = false)
    private Integer mPrice;

    @Column(name = "m_unit")
    private Integer mUnit;

    @Column(name = "m_category", length = 15)
    private String mCategory;
}
