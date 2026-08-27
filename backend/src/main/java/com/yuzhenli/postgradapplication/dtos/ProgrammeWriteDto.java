package com.yuzhenli.postgradapplication.dtos;

import com.yuzhenli.postgradapplication.enums.Country;
import com.yuzhenli.postgradapplication.enums.Degree;
import com.yuzhenli.postgradapplication.enums.Region;
import com.yuzhenli.postgradapplication.enums.Status;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.List;

public record ProgrammeWriteDto(

        @NotBlank(message = "is required")
        String programmeShortName,

        String institutionName,
        String programmeName,

        Region region,
        Country country,

        @Min(value = 1, message = "must be at least 1")
        Integer qsRanking,
        @Min(value = 1, message = "must be at least 1")
        Integer usNewsRanking,
        @Min(value = 1, message = "must be at least 1")
        Integer theRanking,
        @Min(value = 1, message = "must be at least 1")
        Integer arwuRanking,

        Degree degree,

        Status status,

        LocalDate applicationOpens,
        LocalDate applicationDeadline,
        LocalDate referenceDeadline,

        String applicationPortalUrl,

        String programmeLength,

        String ieltsSubmission,
        String greMathRequirement,
        String institutionEtsCode,
        String departmentalEtsCode,

        @Min(value = 0, message = "must be at least 0")
        Integer referenceCount,
        List<
                @NotNull(message = "must not be null")
                @Min(
                        value = 1,
                        message = "must be at least 1"
                )
                        Integer
        > refereeIds,
        String referenceSubmission,
        String informationForRefereesUrl,
        String refereeNotes,

        String applicationFee,
        String annualTuition,
        Boolean fundingAvailable,
        Boolean fundingGuaranteed,

        @Valid
        List<ProgrammeLinkWriteDto> links,

        String notes
) {
}
