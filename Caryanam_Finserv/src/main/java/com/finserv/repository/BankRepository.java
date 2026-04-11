package com.finserv.repository;

import com.finserv.dto.BankDashboardDTO;
import com.finserv.entity.Bank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BankRepository extends JpaRepository<Bank, Long> {

    Optional<Bank> findByBankName(String bankName);

    @Query("""
SELECT new com.finserv.dto.BankDashboardDTO(
    b.id,
    b.bankName,
    b.status,
    b.roiMin,
    b.roiMax,
    b.processingDays,
    b.maxLtv,
    b.maxTenureMonths,
    COUNT(l.id)
)
FROM Bank b
LEFT JOIN LoanApplication l 
    ON l.bank.id = b.id 
    AND MONTH(l.createdDate) = MONTH(CURRENT_DATE)
GROUP BY 
    b.id, b.bankName, b.status, 
    b.roiMin, b.roiMax, 
    b.processingDays, 
    b.maxLtv, b.maxTenureMonths
""")
    List<BankDashboardDTO> getBankDashboard();
}