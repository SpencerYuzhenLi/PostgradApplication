package com.yuzhenli.postgradapplication.dtos;

public record ProgrammeRefereeDto(
        Integer id,
        String name,
        String email,
        boolean submitted
) {
}