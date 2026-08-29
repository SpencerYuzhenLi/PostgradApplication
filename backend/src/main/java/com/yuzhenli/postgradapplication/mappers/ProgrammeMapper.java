package com.yuzhenli.postgradapplication.mappers;

import com.yuzhenli.postgradapplication.dtos.ProgrammeDto;
import com.yuzhenli.postgradapplication.dtos.ProgrammeRefereeDto;
import com.yuzhenli.postgradapplication.dtos.RefereeDto;
import com.yuzhenli.postgradapplication.dtos.RefereeProgrammeDto;
import com.yuzhenli.postgradapplication.entities.Programme;
import com.yuzhenli.postgradapplication.entities.ProgrammeReferee;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.time.LocalDate;
import java.util.List;

@Mapper(
        componentModel = "spring",
        uses = {
                ProgrammeLinkMapper.class,
                RefereeMapper.class
        },
        unmappedTargetPolicy =
                ReportingPolicy.ERROR
)
public interface ProgrammeMapper {

    @Mapping(
            target = "referees",
            source = "programmeReferees"
    )
    ProgrammeDto toProgrammeDto(
            Programme programme
    );

    List<ProgrammeDto> toProgrammeDtoList(
            List<Programme> programmes
    );

    @Mapping(
            target = ".",
            source = "referee"
    )
    RefereeDto toRefereeDto(
            ProgrammeReferee programmeReferee
    );

    @Mapping(
            target = "id",
            source = "referee.id"
    )
    @Mapping(
            target = "name",
            source = "referee.name"
    )
    @Mapping(
            target = "email",
            source = "referee.email"
    )
    @Mapping(
            target = "submitted",
            source = "submitted"
    )
    ProgrammeRefereeDto
    toProgrammeRefereeDto(
            ProgrammeReferee programmeReferee
    );

    @Mapping(
            target = ".",
            source = "programme"
    )
    @Mapping(
            target = "deadline",
            expression =
                    "java(getRefereeDeadline(programmeReferee.getProgramme()))"
    )
    @Mapping(
            target = "submitted",
            source = "submitted"
    )
    RefereeProgrammeDto toRefereeProgrammeDto(
            ProgrammeReferee programmeReferee
    );

    default LocalDate getRefereeDeadline(
            Programme programme
    ) {
        return programme
                .getReferenceDeadline() != null
                ? programme
                .getReferenceDeadline()
                : programme
                .getApplicationDeadline();
    }
}
