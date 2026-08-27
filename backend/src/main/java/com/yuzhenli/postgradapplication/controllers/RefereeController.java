package com.yuzhenli.postgradapplication.controllers;

import com.yuzhenli.postgradapplication.dtos.RefereeDto;
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
    public List<RefereeDto> getAll() {
        return refereeService.getAllReferees();
    }
}