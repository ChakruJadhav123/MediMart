package com.medimart.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "admin")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "admin_seq")
    @SequenceGenerator(name = "admin_seq", sequenceName = "admin_seq", allocationSize = 1)
    @Column(name = "a_id")
    private Integer id;

    @Column(name = "a_fullname", length = 30, nullable = false)
    private String aFullname;

    @Column(name = "a_login_id", length = 10, unique = true, nullable = false)
    private String aLoginId;

    @Column(name = "a_password", nullable = false)
    private String aPassword;

    @Column(name = "a_contact", length = 10)
    private String aContact;

    @Column(name = "a_email", length = 100, unique = true)
    private String aEmail;

    @Column(name = "a_address", length = 50)
    private String aAddress;

    @Column(name = "a_gender", length = 10)
    private String aGender;
}
