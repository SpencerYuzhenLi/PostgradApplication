package com.yuzhenli.postgradapplication.dtos;

import java.time.LocalDate;

public record RefereeProgrammeAssignmentDto(
        Integer programmeId,
        String programmeShortName,
        LocalDate deadline,
        boolean submitted
) {
}
