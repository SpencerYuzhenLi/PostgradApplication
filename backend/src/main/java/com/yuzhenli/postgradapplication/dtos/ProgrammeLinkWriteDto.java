package com.yuzhenli.postgradapplication.dtos;

import jakarta.validation.constraints.NotBlank;

public record ProgrammeLinkWriteDto(

        Integer id,

        @NotBlank(message = "is required")
        String displayName,

        @NotBlank(message = "is required")
        String url
) {
}
