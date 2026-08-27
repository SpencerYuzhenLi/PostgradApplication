package com.yuzhenli.postgradapplication.mappers;

import com.yuzhenli.postgradapplication.dtos.RefereeDto;
import com.yuzhenli.postgradapplication.entities.Referee;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface RefereeMapper {

    RefereeDto toDto(Referee referee);
}