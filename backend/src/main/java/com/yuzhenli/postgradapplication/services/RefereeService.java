package com.yuzhenli.postgradapplication.services;

import com.yuzhenli.postgradapplication.dtos.ManagedRefereeDto;
import com.yuzhenli.postgradapplication.dtos.RefereeAccessLinkDto;
import com.yuzhenli.postgradapplication.dtos.RefereeWriteDto;
import com.yuzhenli.postgradapplication.entities.Referee;
import com.yuzhenli.postgradapplication.mappers.RefereeMapper;
import com.yuzhenli.postgradapplication.repositories.RefereeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RefereeService {

    private final RefereeRepository refereeRepository;
    private final RefereeMapper refereeMapper;
    private final RefereeAccessTokenService refereeAccessTokenService;
    @Value("${app.referee-base-url}")
    private String refereeBaseUrl;

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

    @Transactional
    public ManagedRefereeDto createReferee(
            RefereeWriteDto request
    ) {
        String name =
                requireValue(
                        request.name(),
                        "Name is required."
                );

        String email =
                nullIfBlank(
                        request.email()
                );

        if (
                email != null &&
                        refereeRepository
                                .existsByEmailIgnoreCase(email)
        ) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "A referee with this email already exists."
            );
        }

        Referee referee = new Referee();

        referee.setName(name);
        referee.setEmail(email);

        Referee saved =
                refereeRepository.save(referee);

        return refereeMapper
                .toManagedRefereeDto(saved);
    }

    @Transactional
    public ManagedRefereeDto updateReferee(
            Integer id,
            RefereeWriteDto request
    ) {
        Referee referee =
                refereeRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Referee not found."
                                )
                        );

        String name =
                requireValue(
                        request.name(),
                        "Name is required."
                );

        String email =
                nullIfBlank(
                        request.email()
                );

        if (
                email != null &&
                        refereeRepository
                                .existsByEmailIgnoreCaseAndIdNot(
                                        email,
                                        id
                                )
        ) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "A referee with this email already exists."
            );
        }

        referee.setName(name);
        referee.setEmail(email);

        return refereeMapper
                .toManagedRefereeDto(referee);
    }

    @Transactional
    public void deleteReferee(Integer id) {
        Referee referee =
                refereeRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Referee not found."
                                )
                        );

        refereeRepository.delete(referee);
    }

    @Transactional
    public RefereeAccessLinkDto generateAccessLink(
            Integer id
    ) {
        Referee referee =
                refereeRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Referee not found."
                                )
                        );

        String rawToken =
                refereeAccessTokenService
                        .generateToken();

        String tokenHash =
                refereeAccessTokenService
                        .hashToken(rawToken);

        referee.setAccessTokenHash(
                tokenHash
        );

        String accessUrl =
                buildAccessUrl(rawToken);

        return new RefereeAccessLinkDto(
                accessUrl
        );
    }

    @Transactional
    public void revokeAccess(
            Integer id
    ) {
        Referee referee =
                refereeRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Referee not found."
                                )
                        );

        referee.setAccessTokenHash(
                null
        );
    }

    private String requireValue(
            String value,
            String message
    ) {
        if (
                value == null ||
                        value.isBlank()
        ) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    message
            );
        }

        return value.trim();
    }

    private String nullIfBlank(
            String value
    ) {
        if (
                value == null ||
                        value.isBlank()
        ) {
            return null;
        }

        return value.trim();
    }

    private String buildAccessUrl(
            String rawToken
    ) {
        String baseUrl =
                refereeBaseUrl.endsWith("/")
                        ? refereeBaseUrl
                        : refereeBaseUrl + "/";

        return baseUrl +
                "?t=" +
                rawToken;
    }
}