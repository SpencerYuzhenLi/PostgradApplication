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

    @OneToMany(
            mappedBy = "referee",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private Set<ProgrammeReferee> programmeReferees = new HashSet<>();
}
