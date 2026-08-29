package com.yuzhenli.postgradapplication.controllers;

import com.yuzhenli.postgradapplication.dtos.RefereeProgrammeDto;
import com.yuzhenli.postgradapplication.dtos.RefereeViewDto;
import com.yuzhenli.postgradapplication.dtos.ReferenceSubmissionWriteDto;
import com.yuzhenli.postgradapplication.services.RefereeProgrammeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/referee-programmes")
@RequiredArgsConstructor
public class RefereeProgrammeController {

    private final RefereeProgrammeService refereeProgrammeService;

    @GetMapping
    public RefereeViewDto getProgrammes(
            @RequestHeader(
                    value = "X-Referee-Token",
                    required = false
            )
            String accessToken
    ) {
        return refereeProgrammeService
                .getProgrammesForAccessToken(
                        accessToken
                );
    }

    @PutMapping("/{programmeId}/submission")
    public RefereeProgrammeDto
    updateSubmissionStatus(
            @PathVariable Integer programmeId,

            @RequestHeader(
                    value = "X-Referee-Token",
                    required = false
            )
            String accessToken,

            @RequestBody
            ReferenceSubmissionWriteDto request
    ) {
        return refereeProgrammeService
                .updateSubmissionStatus(
                        accessToken,
                        programmeId,
                        request.submitted()
                );
    }
}
