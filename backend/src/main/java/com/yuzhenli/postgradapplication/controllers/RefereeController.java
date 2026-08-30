package com.yuzhenli.postgradapplication.controllers;

import com.yuzhenli.postgradapplication.dtos.ManagedRefereeDto;
import com.yuzhenli.postgradapplication.dtos.RefereeAccessLinkDto;
import com.yuzhenli.postgradapplication.dtos.RefereeWriteDto;
import com.yuzhenli.postgradapplication.services.RefereeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/referees")
@RequiredArgsConstructor
public class RefereeController {

    private final RefereeService refereeService;

    @GetMapping
    public List<ManagedRefereeDto> getAll() {
        return refereeService.getAllReferees();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ManagedRefereeDto createReferee(
            @RequestBody RefereeWriteDto request
    ) {
        return refereeService
                .createReferee(request);
    }

    @PutMapping("/{id}")
    public ManagedRefereeDto updateReferee(
            @PathVariable Integer id,
            @RequestBody RefereeWriteDto request
    ) {
        return refereeService
                .updateReferee(
                        id,
                        request
                );
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteReferee(
            @PathVariable Integer id
    ) {
        refereeService.deleteReferee(id);
    }

    @PostMapping("/{id}/access-link")
    public RefereeAccessLinkDto
    generateAccessLink(
            @PathVariable Integer id
    ) {
        return refereeService
                .generateAccessLink(id);
    }

    @DeleteMapping("/{id}/access-link")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void revokeAccess(
            @PathVariable Integer id
    ) {
        refereeService.revokeAccess(id);
    }
}