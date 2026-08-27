package com.yuzhenli.postgradapplication.controllers;

import com.yuzhenli.postgradapplication.dtos.RefereeProgrammeDto;
import com.yuzhenli.postgradapplication.services.ProgrammeService;
import com.yuzhenli.postgradapplication.services.RefereeProgrammeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/referee-programmes")
@RequiredArgsConstructor
public class RefereeProgrammeController {

    private final RefereeProgrammeService refereeProgrammeService;

    @GetMapping
    public List<RefereeProgrammeDto> getProgrammes(
            @RequestParam Integer refereeId
    ) {
        return refereeProgrammeService
                .getProgrammesForReferee(refereeId);
    }
}
