package com.yuzhenli.postgradapplication.repositories;

import com.yuzhenli.postgradapplication.entities.ProgrammeReferee;
import com.yuzhenli.postgradapplication.entities.ProgrammeRefereeId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProgrammeRefereeRepository
        extends JpaRepository<
                ProgrammeReferee,
                ProgrammeRefereeId
                > {
    Optional<ProgrammeReferee>
    findByProgramme_IdAndReferee_Id(
            Integer programmeId,
            Integer refereeId
    );
}
