package com.yuzhenli.postgradapplication;

import com.yuzhenli.postgradapplication.entities.Programme;
import com.yuzhenli.postgradapplication.enums.Country;
import com.yuzhenli.postgradapplication.enums.Region;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import com.yuzhenli.postgradapplication.repositories.ProgrammeRepository;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;


@SpringBootTest
public class ProgrammeRepositoryTest {

    @Autowired
    private ProgrammeRepository programmeRepository;

    @Test
    void shouldRetrieveOxfordProgramme() {
        List<Programme> programmes = programmeRepository.findAll();

        assertFalse(programmes.isEmpty());

        Programme programme = programmes.getFirst();

        assertEquals(
                "University of Oxford",
                programme.getInstitutionName()
        );

        assertEquals(
                Region.UNITED_KINGDOM,
                programme.getRegion()
        );

        assertEquals(
                Country.UNITED_KINGDOM,
                programme.getCountry()
        );
    }
}
