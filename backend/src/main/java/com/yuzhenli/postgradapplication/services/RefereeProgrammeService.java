package com.yuzhenli.postgradapplication.services;

import com.yuzhenli.postgradapplication.dtos.RefereeProgrammeDto;
import com.yuzhenli.postgradapplication.entities.Referee;
import com.yuzhenli.postgradapplication.mappers.ProgrammeMapper;
import com.yuzhenli.postgradapplication.repositories.RefereeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RefereeProgrammeService {

    private final RefereeAccessTokenService refereeAccessTokenService;
    private final RefereeRepository refereeRepository;
    private final ProgrammeMapper programmeMapper;

    @Transactional(readOnly = true)
    public List<RefereeProgrammeDto>
    getProgrammesForAccessToken(
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

        Referee referee =
                refereeRepository
                        .findByAccessTokenHash(
                                tokenHash
                        )
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.UNAUTHORIZED,
                                        "Invalid referee access token"
                                )
                        );

        return referee
                .getProgrammes()
                .stream()
                .map(
                        programmeMapper
                                ::toRefereeProgrammeDto
                )
                .toList();
    }
}