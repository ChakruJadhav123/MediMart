package com.medimart.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "system_settings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SystemSetting {

    @Id
    @Column(name = "s_key", length = 50)
    private String key;

    @Column(name = "s_value", length = 255)
    private String value;
}
