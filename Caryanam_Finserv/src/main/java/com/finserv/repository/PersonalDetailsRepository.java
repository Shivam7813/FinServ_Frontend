package com.finserv.repository;


import com.finserv.entity.PersonalDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Arrays;
import java.util.List;

@Repository
public interface PersonalDetailsRepository extends JpaRepository<PersonalDetails, Long> {

    List<PersonalDetails> findByFullNameContainingIgnoreCase(String name);
    PersonalDetails findByUserId(Long userId);
}
