package com.yuzhenli.postgradapplication.repositories;

import com.yuzhenli.postgradapplication.entities.Referee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RefereeRepository
        extends JpaRepository<Referee, Integer> {
}