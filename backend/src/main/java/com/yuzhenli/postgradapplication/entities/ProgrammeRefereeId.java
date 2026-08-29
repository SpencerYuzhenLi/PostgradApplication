package com.yuzhenli.postgradapplication.entities;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class ProgrammeRefereeId
        implements Serializable {

    @Column(name = "programme_id")
    private Integer programmeId;

    @Column(name = "referee_id")
    private Integer refereeId;
}
