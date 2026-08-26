package com.yuzhenli.postgradapplication.mappers;

import com.yuzhenli.postgradapplication.dtos.ProgrammeLinkDto;
import com.yuzhenli.postgradapplication.entities.ProgrammeLink;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.ERROR
)
public interface ProgrammeLinkMapper {

    ProgrammeLinkDto toDto(ProgrammeLink programmeLink);
}
