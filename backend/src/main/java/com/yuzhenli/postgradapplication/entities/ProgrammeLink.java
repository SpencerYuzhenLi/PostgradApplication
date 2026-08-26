package com.yuzhenli.postgradapplication.entities;

import jakarta.persistence.*;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@Entity
@Table(name = "programme_links")
public class ProgrammeLink {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "programme_id", nullable = false)
    private Programme programme;

    @Column(name = "url", nullable = false)
    private String url;

    @Column(name = "display_name", nullable = false)
    private String displayName;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder;
}