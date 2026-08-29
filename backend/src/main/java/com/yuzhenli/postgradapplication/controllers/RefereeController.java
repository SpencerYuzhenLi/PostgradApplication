package com.yuzhenli.postgradapplication.controllers;

import com.yuzhenli.postgradapplication.dtos.ManagedRefereeDto;
import com.yuzhenli.postgradapplication.services.RefereeService;
import lombok.RequiredArgsConstructor;
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
}