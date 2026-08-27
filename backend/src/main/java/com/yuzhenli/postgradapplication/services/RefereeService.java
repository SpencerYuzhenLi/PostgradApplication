package com.yuzhenli.postgradapplication.services;

import com.yuzhenli.postgradapplication.dtos.RefereeDto;
import com.yuzhenli.postgradapplication.mappers.RefereeMapper;
import com.yuzhenli.postgradapplication.repositories.RefereeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RefereeService {

    private final RefereeRepository refereeRepository;
    private final RefereeMapper refereeMapper;

    public List<RefereeDto> getAllReferees() {
        return refereeRepository
                .findAll()
                .stream()
                .map(refereeMapper::toDto)
                .toList();
    }
}