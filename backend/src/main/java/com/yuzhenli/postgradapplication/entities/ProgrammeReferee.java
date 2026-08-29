package com.yuzhenli.postgradapplication.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "programme_referees")
@Getter
@Setter
@NoArgsConstructor
public class ProgrammeReferee {

    @EmbeddedId
    private ProgrammeRefereeId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("programmeId")
    @JoinColumn(name = "programme_id")
    private Programme programme;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("refereeId")
    @JoinColumn(name = "referee_id")
    private Referee referee;

    @Column(
            name = "submitted",
            nullable = false
    )
    private boolean submitted;
}
