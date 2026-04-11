package com.finserv.repository;

import com.finserv.entity.VehicleDetails;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VehicleRepository extends JpaRepository<VehicleDetails, Long> {

    Optional<VehicleDetails> findByLoanApplicationId(Long loanId);
}
