package com.yuzhenli.postgradapplication.services;

import com.yuzhenli.postgradapplication.dtos.ProgrammeDto;
import com.yuzhenli.postgradapplication.dtos.ProgrammeLinkWriteDto;
import com.yuzhenli.postgradapplication.dtos.ProgrammeRefereeWriteDto;
import com.yuzhenli.postgradapplication.dtos.ProgrammeWriteDto;
import com.yuzhenli.postgradapplication.entities.Programme;
import com.yuzhenli.postgradapplication.entities.ProgrammeLink;
import com.yuzhenli.postgradapplication.entities.ProgrammeReferee;
import com.yuzhenli.postgradapplication.entities.Referee;
import com.yuzhenli.postgradapplication.mappers.ProgrammeMapper;
import com.yuzhenli.postgradapplication.repositories.ProgrammeRepository;
import com.yuzhenli.postgradapplication.repositories.RefereeRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProgrammeService {

    private final ProgrammeRepository programmeRepository;
    private final ProgrammeMapper programmeMapper;
    private final RefereeRepository refereeRepository;

    public List<ProgrammeDto> getAllProgrammes() {
        return programmeMapper.toProgrammeDtoList(programmeRepository.findAll());
    }

    @Transactional
    public ProgrammeDto createProgramme(
            ProgrammeWriteDto request
    ) {
        String shortName =
                request.programmeShortName().trim();

        if (
                programmeRepository
                        .existsByProgrammeShortName(shortName)
        ) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Programme short name already exists."
            );
        }

        Programme programme = new Programme();

        applyProgrammeWrite(programme, request);
        applyProgrammeReferees(programme, request.referees());
        applyProgrammeLinks(programme, request.links());

        Programme saved =
                programmeRepository.save(programme);

        return programmeMapper.toProgrammeDto(saved);
    }

    @Transactional
    public ProgrammeDto updateProgramme(
            Integer id,
            ProgrammeWriteDto request
    ) {
        Programme programme = programmeRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Programme not found"
                        )
                );

        String shortName =
                request.programmeShortName().trim();

        if (
                programmeRepository
                        .existsByProgrammeShortNameAndIdNot(
                                shortName,
                                id
                        )
        ) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Programme short name already exists."
            );
        }

        applyProgrammeWrite(programme, request);
        applyProgrammeReferees(programme, request.referees());
        applyProgrammeLinks(programme, request.links());

        return programmeMapper.toProgrammeDto(programme);
    }

    @Transactional
    public void deleteProgramme(Integer id) {
        Programme programme = programmeRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Programme not found"
                        )
                );

        programmeRepository.delete(programme);
    }

    private void applyProgrammeWrite(
            Programme programme,
            ProgrammeWriteDto request
    ) {
        programme.setProgrammeShortName(
                request.programmeShortName().trim()
        );

        programme.setInstitutionName(
                nullIfBlank(request.institutionName())
        );

        programme.setProgrammeName(
                nullIfBlank(request.programmeName())
        );

        programme.setRegion(request.region());
        programme.setCountry(request.country());

        programme.setQsRanking(request.qsRanking());
        programme.setUsNewsRanking(request.usNewsRanking());
        programme.setTheRanking(request.theRanking());
        programme.setArwuRanking(request.arwuRanking());

        programme.setDegree(request.degree());
        programme.setStatus(request.status());

        programme.setApplicationOpens(request.applicationOpens());
        programme.setApplicationDeadline(request.applicationDeadline());
        programme.setReferenceDeadline(request.referenceDeadline());

        programme.setApplicationPortalUrl(
                nullIfBlank(request.applicationPortalUrl())
        );

        programme.setProgrammeLength(
                nullIfBlank(request.programmeLength())
        );

        programme.setIeltsSubmission(
                nullIfBlank(request.ieltsSubmission())
        );

        programme.setGreMathRequirement(
                nullIfBlank(request.greMathRequirement())
        );

        programme.setInstitutionEtsCode(
                nullIfBlank(request.institutionEtsCode())
        );

        programme.setDepartmentalEtsCode(
                nullIfBlank(request.departmentalEtsCode())
        );

        programme.setReferenceCount(request.referenceCount());

        programme.setReferenceSubmission(
                nullIfBlank(request.referenceSubmission())
        );

        programme.setInformationForRefereesUrl(
                nullIfBlank(request.informationForRefereesUrl())
        );

        programme.setRefereeNotes(
                nullIfBlank(request.refereeNotes())
        );

        programme.setApplicationFee(
                nullIfBlank(request.applicationFee())
        );

        programme.setAnnualTuition(
                nullIfBlank(request.annualTuition())
        );

        programme.setFundingAvailable(request.fundingAvailable());
        programme.setFundingGuaranteed(request.fundingGuaranteed());

        programme.setNotes(
                nullIfBlank(request.notes())
        );
    }

    private void applyProgrammeReferees(
            Programme programme,
            List<ProgrammeRefereeWriteDto> requests
    ) {
        List<ProgrammeRefereeWriteDto> safeRequests =
                requests == null
                        ? List.of()
                        : requests;

        if (
                safeRequests
                        .stream()
                        .anyMatch(
                                request ->
                                        request.refereeId()
                                                == null
                        )
        ) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Referee ID is required."
            );
        }

        Set<Integer> refereeIds =
                safeRequests
                        .stream()
                        .map(
                                ProgrammeRefereeWriteDto::refereeId
                        )
                        .collect(
                                Collectors.toSet()
                        );

        if (
                refereeIds.size() !=
                        safeRequests.size()
        ) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Duplicate referee assignment."
            );
        }

        Map<Integer, Referee> refereesById =
                resolveReferees(refereeIds)
                        .stream()
                        .collect(
                                Collectors.toMap(
                                        Referee::getId,
                                        Function.identity()
                                )
                        );

        Map<Integer, ProgrammeReferee>
                existingByRefereeId =
                programme
                        .getProgrammeReferees()
                        .stream()
                        .collect(
                                Collectors.toMap(
                                        assignment ->
                                                assignment
                                                        .getReferee()
                                                        .getId(),
                                        Function.identity()
                                )
                        );

        Set<ProgrammeReferee>
                updatedAssignments =
                new HashSet<>();

        for (
                ProgrammeRefereeWriteDto request :
                safeRequests
        ) {
            Referee referee =
                    refereesById.get(
                            request.refereeId()
                    );

            ProgrammeReferee assignment =
                    existingByRefereeId.get(
                            request.refereeId()
                    );

            if (assignment == null) {
                assignment =
                        new ProgrammeReferee();

                assignment.setProgramme(
                        programme
                );

                assignment.setReferee(
                        referee
                );
            }

            assignment.setSubmitted(
                    request.submitted()
            );

            updatedAssignments.add(
                    assignment
            );
        }

        programme
                .getProgrammeReferees()
                .clear();

        programme
                .getProgrammeReferees()
                .addAll(
                        updatedAssignments
                );
    }

    private void applyProgrammeLinks(
            Programme programme,
            List<ProgrammeLinkWriteDto> requests
    ) {
        List<ProgrammeLinkWriteDto> safeRequests =
                requests == null
                        ? List.of()
                        : requests;

        Map<Integer, ProgrammeLink> existingById =
                programme.getLinks()
                        .stream()
                        .filter(link ->
                                link.getId() != null
                        )
                        .collect(Collectors.toMap(
                                ProgrammeLink::getId,
                                Function.identity()
                        ));

        List<ProgrammeLink> orderedLinks = new ArrayList<>();

        for (int i = 0; i < safeRequests.size(); i++) {
            ProgrammeLinkWriteDto request = safeRequests.get(i);

            ProgrammeLink link;

            if (request.id() == null) {
                link = new ProgrammeLink();
                link.setProgramme(programme);
            } else {
                link = existingById.get(request.id());

                if (link == null) {
                    throw new ResponseStatusException(
                            HttpStatus.BAD_REQUEST,
                            "Invalid programme link"
                    );
                }
            }

            link.setDisplayName(
                    nullIfBlank(request.displayName())
            );
            link.setUrl(
                    nullIfBlank(request.url())
            );
            link.setDisplayOrder((i + 1) * 10);

            orderedLinks.add(link);
        }

        programme.getLinks().clear();
        programme.getLinks().addAll(orderedLinks);
    }

    private Set<Referee> resolveReferees(
            Set<Integer> refereeIds
    ) {
        if (
                refereeIds == null ||
                        refereeIds.isEmpty()
        ) {
            return new HashSet<>();
        }

        List<Referee> referees =
                refereeRepository.findAllById(
                        refereeIds
                );

        if (
                referees.size() !=
                        refereeIds.size()
        ) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid referee selection."
            );
        }

        return new HashSet<>(
                referees
        );
    }

    private String nullIfBlank(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }
}
