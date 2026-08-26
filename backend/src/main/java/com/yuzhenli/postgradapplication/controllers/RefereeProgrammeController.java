package com.yuzhenli.postgradapplication.controllers;

import com.yuzhenli.postgradapplication.dtos.RefereeProgrammeDto;
import com.yuzhenli.postgradapplication.services.ProgrammeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/referee-programmes")
@RequiredArgsConstructor
public class RefereeProgrammeController {

    private final ProgrammeService programmeService;

    @GetMapping
    public List<RefereeProgrammeDto> getAll() {
        return programmeService
                .getAllRefereeProgrammes();
    }
}
