package com.medimart.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "customer")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "customer_seq")
    @SequenceGenerator(name = "customer_seq", sequenceName = "customer_seq", allocationSize = 1)
    @Column(name = "c_id")
    private Integer id;

    @Column(name = "c_fullname", length = 30, nullable = false)
    private String cFullname;

    @Column(name = "c_login_id", length = 10, unique = true, nullable = false)
    private String cLoginId;

    @Column(name = "c_password", nullable = false)
    private String cPassword;

    @Column(name = "c_contact", length = 10)
    private String cContact;

    @Column(name = "c_email", length = 100, unique = true)
    private String cEmail;

    @Column(name = "c_address", length = 50)
    private String cAddress;

    @Column(name = "c_gender", length = 10)
    private String cGender;
}
