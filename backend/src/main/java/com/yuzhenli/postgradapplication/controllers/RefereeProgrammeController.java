package com.yuzhenli.postgradapplication.controllers;

import com.yuzhenli.postgradapplication.dtos.RefereeViewDto;
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
}
