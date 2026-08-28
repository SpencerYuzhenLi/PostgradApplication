package com.yuzhenli.postgradapplication.dtos;

import java.util.List;

public record RefereeViewDto(
        String refereeName,
        List<RefereeProgrammeDto> programmes
) {
}
