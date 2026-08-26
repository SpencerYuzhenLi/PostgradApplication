package com.yuzhenli.postgradapplication.controllers;

import com.yuzhenli.postgradapplication.dtos.ProgrammeDto;
import com.yuzhenli.postgradapplication.dtos.ProgrammeWriteDto;
import com.yuzhenli.postgradapplication.dtos.RefereeProgrammeDto;
import com.yuzhenli.postgradapplication.services.ProgrammeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/programmes")
@RequiredArgsConstructor
public class ProgrammeController {

    private final ProgrammeService programmeService;

    @GetMapping
    public List<ProgrammeDto> getAllProgrammes() {
        return programmeService.getAllProgrammes();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProgrammeDto createProgramme(
            @Valid @RequestBody ProgrammeWriteDto request
    ) {
        return programmeService.createProgramme(request);
    }

    @PutMapping("/{id}")
    public ProgrammeDto updateProgramme(
            @PathVariable Integer id,
            @Valid @RequestBody ProgrammeWriteDto request
    ) {
        return programmeService.updateProgramme(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProgramme(
            @PathVariable Integer id
    ) {
        programmeService.deleteProgramme(id);
    }
}
