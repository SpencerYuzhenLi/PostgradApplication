package com.yuzhenli.postgradapplication.dtos;

import java.util.List;

public record ManagedRefereeDto(
        Integer id,
        String name,
        String email,
        boolean accessActive,
        List<RefereeProgrammeAssignmentDto> programmes
) {
}
