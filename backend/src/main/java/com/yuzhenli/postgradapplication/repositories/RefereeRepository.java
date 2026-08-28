package com.yuzhenli.postgradapplication.repositories;

import com.yuzhenli.postgradapplication.entities.Referee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RefereeRepository
        extends JpaRepository<Referee, Integer> {
    Optional<Referee> findByAccessTokenHash(
            String accessTokenHash
    );
}