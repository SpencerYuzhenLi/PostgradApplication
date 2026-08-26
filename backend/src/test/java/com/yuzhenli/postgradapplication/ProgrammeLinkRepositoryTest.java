package com.yuzhenli.postgradapplication;

import com.yuzhenli.postgradapplication.entities.ProgrammeLink;
import com.yuzhenli.postgradapplication.repositories.ProgrammeLinkRepository;
import lombok.RequiredArgsConstructor;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;

@SpringBootTest
@RequiredArgsConstructor
class ProgrammeLinkRepositoryTest {

    @Autowired
    private ProgrammeLinkRepository programmeLinkRepository;

    @Test
    void shouldFindLinksForProgramme() {
        List<ProgrammeLink> links =
                programmeLinkRepository
                        .findByProgramme_IdOrderByDisplayOrderAscIdAsc(3);

        assertFalse(links.isEmpty());
        assertEquals(
                3,
                links.getFirst().getProgramme().getId()
        );
    }
}
