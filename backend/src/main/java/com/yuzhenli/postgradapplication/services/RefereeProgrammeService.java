package com.yuzhenli.postgradapplication.services;

import com.yuzhenli.postgradapplication.dtos.RefereeProgrammeDto;
import com.yuzhenli.postgradapplication.dtos.RefereeViewDto;
import com.yuzhenli.postgradapplication.entities.ProgrammeReferee;
import com.yuzhenli.postgradapplication.entities.Referee;
import com.yuzhenli.postgradapplication.mappers.ProgrammeMapper;
import com.yuzhenli.postgradapplication.repositories.ProgrammeRefereeRepository;
import com.yuzhenli.postgradapplication.repositories.RefereeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RefereeProgrammeService {

    private final RefereeAccessTokenService refereeAccessTokenService;
    private final RefereeRepository refereeRepository;
    private final ProgrammeRefereeRepository programmeRefereeRepository;
    private final ProgrammeMapper programmeMapper;

    @Transactional(readOnly = true)
    public RefereeViewDto getProgrammesForAccessToken(
            String accessToken
    ) {
        Referee referee = resolveReferee(accessToken);

        List<RefereeProgrammeDto> programmes =
                referee
                        .getProgrammeReferees()
                        .stream()
                        .sorted(
                                Comparator.comparing(
                                        assignment ->
                                                assignment
                                                        .getProgramme()
                                                        .getProgrammeShortName(),
                                        Comparator.nullsLast(
                                                String.CASE_INSENSITIVE_ORDER
                                        )
                                )
                        )
                        .map(
                                programmeMapper
                                        ::toRefereeProgrammeDto
                        )
                        .toList();

        return new RefereeViewDto(
                referee.getName(),
                programmes
        );
    }

    @Transactional
    public RefereeProgrammeDto
    updateSubmissionStatus(
            String accessToken,
            Integer programmeId,
            boolean submitted
    ) {
        Referee referee =
                resolveReferee(accessToken);

        ProgrammeReferee assignment =
                programmeRefereeRepository
                        .findByProgramme_IdAndReferee_Id(
                                programmeId,
                                referee.getId()
                        )
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Programme assignment not found"
                                )
                        );

        assignment.setSubmitted(
                submitted
        );

        return programmeMapper
                .toRefereeProgrammeDto(
                        assignment
                );
    }

    private Referee resolveReferee(
            String accessToken
    ) {
        if (
                accessToken == null ||
                        accessToken.isBlank()
        ) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid referee access token"
            );
        }

        String tokenHash =
                refereeAccessTokenService
                        .hashToken(accessToken);

        return refereeRepository
                        .findByAccessTokenHash(
                                tokenHash
                        )
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.UNAUTHORIZED,
                                        "Invalid referee access token"
                                )
                        );
    }
}