package com.yuzhenli.postgradapplication.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@Entity
@Table(name = "referees")
public class Referee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "email")
    private String email;

    @Column(
            name = "access_token_hash",
            length = 64,
            unique = true
    )
    private String accessTokenHash;

    @ManyToMany(mappedBy = "referees")
    @Builder.Default
    private Set<Programme> programmes =
            new HashSet<>();
}
