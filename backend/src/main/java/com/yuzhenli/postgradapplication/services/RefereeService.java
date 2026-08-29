package com.yuzhenli.postgradapplication.services;

import com.yuzhenli.postgradapplication.dtos.ManagedRefereeDto;
import com.yuzhenli.postgradapplication.dtos.RefereeDto;
import com.yuzhenli.postgradapplication.entities.Referee;
import com.yuzhenli.postgradapplication.mappers.RefereeMapper;
import com.yuzhenli.postgradapplication.repositories.RefereeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RefereeService {

    private final RefereeRepository refereeRepository;
    private final RefereeMapper refereeMapper;

    public List<ManagedRefereeDto> getAllReferees() {
        return refereeRepository
                .findAll()
                .stream()
                .sorted(
                        Comparator.comparing(
                                Referee::getName,
                                String.CASE_INSENSITIVE_ORDER
                        )
                )
                .map(
                        refereeMapper
                                ::toManagedRefereeDto
                )
                .toList();
    }
}