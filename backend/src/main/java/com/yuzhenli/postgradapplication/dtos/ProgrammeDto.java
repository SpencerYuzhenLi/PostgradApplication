package com.yuzhenli.postgradapplication.dtos;

import com.yuzhenli.postgradapplication.enums.Status;
import com.yuzhenli.postgradapplication.enums.Country;
import com.yuzhenli.postgradapplication.enums.Degree;
import com.yuzhenli.postgradapplication.enums.Region;

import java.time.LocalDate;
import java.util.List;

public record ProgrammeDto(
        Integer id,
        String programmeShortName,

        String institutionName,
        String programmeName,

        Region region,
        Country country,

        Integer qsRanking,
        Integer usNewsRanking,
        Integer theRanking,
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

        Integer referenceCount,
        String referenceSubmission,
        String informationForRefereesUrl,
        String refereeNotes,

        String applicationFee,
        String annualTuition,
        Boolean fundingAvailable,
        Boolean fundingGuaranteed,

        List<ProgrammeLinkDto> links,

        String notes
) {
}
