package com.yuzhenli.postgradapplication.services;

import com.yuzhenli.postgradapplication.dtos.RefereeProgrammeDto;
import com.yuzhenli.postgradapplication.mappers.ProgrammeMapper;
import com.yuzhenli.postgradapplication.repositories.RefereeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RefereeProgrammeService {

    private final RefereeRepository refereeRepository;
    private final ProgrammeMapper programmeMapper;

    public List<RefereeProgrammeDto> getProgrammesForReferee(
            Integer refereeId
    ) {
        var referee =
                refereeRepository.findById(refereeId)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Referee not found"
                                )
                        );

        return referee.getProgrammes()
                .stream()
                .map(programmeMapper::toRefereeProgrammeDto)
                .sorted(
                        Comparator.comparing(
                                RefereeProgrammeDto::programmeShortName,
                                Comparator.nullsLast(
                                        String.CASE_INSENSITIVE_ORDER
                                )
                        )
                )
                .toList();
    }
}