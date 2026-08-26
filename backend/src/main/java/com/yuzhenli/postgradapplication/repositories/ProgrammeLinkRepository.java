package com.yuzhenli.postgradapplication.repositories;

import com.yuzhenli.postgradapplication.entities.ProgrammeLink;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProgrammeLinkRepository
        extends JpaRepository<ProgrammeLink, Integer> {

    List<ProgrammeLink>
        findByProgramme_IdOrderByDisplayOrderAscIdAsc(
            Integer programmeId
    );
}
