package com.finserv.repository;


import com.finserv.dto.CustomerDashboardDTO;
import com.finserv.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    @Query("""

    SELECT new com.finserv.dto.CustomerDashboardDTO(
    u.id,
    COALESCE(p.fullName, u.fullName),
    u.email,
    u.mobileNumber,
    p.panNumber,
    COUNT(l),
    SUM(CASE WHEN l.status = 'APPROVED' THEN 1L ELSE 0L END),
    COALESCE(SUM(l.loanAmount), 0.0)
            )
    FROM User u
    LEFT JOIN u.personalDetails p
    LEFT JOIN u.loanApplications l
    GROUP BY
    u.id,
    p.fullName,
    u.email,
    u.mobileNumber,
    p.panNumber
""")
    List<CustomerDashboardDTO> getDashboardData();


 }