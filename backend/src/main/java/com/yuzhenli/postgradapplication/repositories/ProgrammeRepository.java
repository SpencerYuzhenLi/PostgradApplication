package com.yuzhenli.postgradapplication.repositories;

import com.yuzhenli.postgradapplication.entities.Programme;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProgrammeRepository
        extends JpaRepository<Programme, Integer> {

    @EntityGraph(attributePaths = "links")
    @Override
    List<Programme> findAll();

    boolean existsByProgrammeShortName(
            String programmeShortName
    );

    boolean existsByProgrammeShortNameAndIdNot(
            String programmeShortName,
            Integer id
    );
}
