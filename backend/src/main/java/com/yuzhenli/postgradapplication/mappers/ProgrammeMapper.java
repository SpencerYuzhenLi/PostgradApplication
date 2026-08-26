package com.yuzhenli.postgradapplication.mappers;

import com.yuzhenli.postgradapplication.dtos.ProgrammeDto;
import com.yuzhenli.postgradapplication.dtos.RefereeProgrammeDto;
import com.yuzhenli.postgradapplication.entities.Programme;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.time.LocalDate;
import java.util.List;

@Mapper(
        componentModel = "spring",
        uses = ProgrammeLinkMapper.class,
        unmappedTargetPolicy = ReportingPolicy.ERROR
)
public interface ProgrammeMapper {

    ProgrammeDto toProgrammeDto(Programme programme);

    List<ProgrammeDto> toProgrammeDtoList(List<Programme> programmes);

    @Mapping(
            target = "deadline",
            expression = "java(getRefereeDeadline(programme))"
    )
    RefereeProgrammeDto toRefereeProgrammeDto(Programme programme);

    default LocalDate getRefereeDeadline(
            Programme programme
    ) {
        LocalDate applicationDeadline =
                programme.getApplicationDeadline();

        LocalDate referenceDeadline =
                programme.getReferenceDeadline();

        if (applicationDeadline == null) {
            return referenceDeadline;
        }

        if (referenceDeadline == null) {
            return applicationDeadline;
        }

        return applicationDeadline.isBefore(referenceDeadline)
                ? applicationDeadline
                : referenceDeadline;
    }
}
