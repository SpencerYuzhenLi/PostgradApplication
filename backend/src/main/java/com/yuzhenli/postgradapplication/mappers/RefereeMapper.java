package com.yuzhenli.postgradapplication.mappers;

import com.yuzhenli.postgradapplication.dtos.ManagedRefereeDto;
import com.yuzhenli.postgradapplication.dtos.RefereeDto;
import com.yuzhenli.postgradapplication.dtos.RefereeProgrammeAssignmentDto;
import com.yuzhenli.postgradapplication.entities.Programme;
import com.yuzhenli.postgradapplication.entities.ProgrammeReferee;
import com.yuzhenli.postgradapplication.entities.Referee;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.time.LocalDate;

@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.ERROR
)
public interface RefereeMapper {

    RefereeDto toRefereeDto(
            Referee referee
    );

    @Mapping(
            target = "accessActive",
            expression =
                    "java(referee.getAccessTokenHash() != null)"
    )
    @Mapping(
            target = "programmes",
            source = "programmeReferees"
    )
    ManagedRefereeDto toManagedRefereeDto(
            Referee referee
    );

    @Mapping(
            target = "programmeId",
            source = "programme.id"
    )
    @Mapping(
            target = "programmeShortName",
            source = "programme.programmeShortName"
    )
    @Mapping(
            target = "deadline",
            expression =
                    "java(getDeadline(programmeReferee))"
    )
    @Mapping(
            target = "submitted",
            source = "submitted"
    )
    RefereeProgrammeAssignmentDto
    toProgrammeAssignmentDto(
            ProgrammeReferee programmeReferee
    );

    default LocalDate getDeadline(
            ProgrammeReferee programmeReferee
    ) {
        Programme programme =
                programmeReferee.getProgramme();

        return programme.getReferenceDeadline() != null
                ? programme.getReferenceDeadline()
                : programme.getApplicationDeadline();
    }
}