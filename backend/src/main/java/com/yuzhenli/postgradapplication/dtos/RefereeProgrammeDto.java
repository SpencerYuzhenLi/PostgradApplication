package com.yuzhenli.postgradapplication.dtos;

import java.time.LocalDate;

public record RefereeProgrammeDto(
        Integer id,

        String programmeShortName,
        String institutionName,
        String programmeName,

        LocalDate applicationOpens,
        LocalDate deadline,

        String referenceSubmission,
        boolean submitted,
        String informationForRefereesUrl,
        String refereeNotes
) {
}
