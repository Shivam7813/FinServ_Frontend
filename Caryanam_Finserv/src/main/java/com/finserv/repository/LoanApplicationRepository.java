package com.finserv.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.finserv.dto.LoanDashboardDTO;
import com.finserv.dto.RecentLoanDTO;
import com.finserv.dto.reportDTO.BankDistributionDTO;
import com.finserv.dto.reportDTO.BankTurnaroundDTO;
import com.finserv.dto.reportDTO.MonthlyDisbursementDTO;
import com.finserv.dto.reportDTO.MonthlyStatusDTO;
import com.finserv.entity.LoanApplication;
import com.finserv.enums.LoanStatus;

public interface LoanApplicationRepository extends JpaRepository<LoanApplication, Long> {

    List<LoanApplication> findByUserId(Long userId);

    @Query("""
    SELECT new com.finserv.dto.LoanDashboardDTO(
    l.caseNumber,
    pd.fullName,
    u.mobileNumber,
    pd.email,
    CONCAT(v.carMake, ' ', v.model),
    l.loanAmount,
    l.downPayment,
    l.tenure,
    e.employmentType,
    b.bankName,
    l.status,
    l.loanType,
    l.createdDate,
    NULL,
    l.adminRemark
    )
    FROM LoanApplication l
    JOIN l.user u
    LEFT JOIN u.personalDetails pd
    LEFT JOIN u.employmentDetails e
    LEFT JOIN l.vehicle v
    LEFT JOIN l.bank b
    WHERE l.isDeleted = false
    """)
    List<LoanDashboardDTO> getAllLoanCases();

    //Optional<LoanApplication> findByCaseNumber(String caseNumber);

    // Active Loans
    Long countByStatus(LoanStatus status);

    @Query("""
                SELECT COUNT(l)
                FROM LoanApplication l
                WHERE l.status = com.finserv.enums.LoanStatus.APPROVED
                  AND l.createdDate = CURRENT_DATE
            """)
    Long countApprovedToday();

    @Query("""
                SELECT COALESCE(SUM(l.loanAmount), 0)
                FROM LoanApplication l
                WHERE l.status = com.finserv.enums.LoanStatus.UNDER_REVIEW
                  AND FUNCTION('MONTH', l.createdDate) = FUNCTION('MONTH', CURRENT_DATE)
                  AND FUNCTION('YEAR', l.createdDate) = FUNCTION('YEAR', CURRENT_DATE)
            """)
    Double getDisbursedThisMonth();

    // Recent Loans
    @Query("""
                SELECT new com.finserv.dto.RecentLoanDTO(
                    l.caseNumber,
                    pd.fullName,
                    l.loanAmount,
                    l.status,
                    l.createdDate
                )
                FROM LoanApplication l
                LEFT JOIN l.user u
                LEFT JOIN u.personalDetails pd
                ORDER BY l.createdDate DESC
            """)
    List<RecentLoanDTO> getRecentLoans(org.springframework.data.domain.Pageable pageable);

    @Query("""
            SELECT l
            FROM LoanApplication l
            LEFT JOIN l.user u
            LEFT JOIN u.personalDetails pd
            WHERE (:caseNumber IS NULL OR LOWER(l.caseNumber) LIKE LOWER(CONCAT('%', :caseNumber, '%')))
            AND (:name IS NULL OR :name = '' OR LOWER(pd.fullName) LIKE LOWER(CONCAT('%', :name, '%')))
        """)
        List<LoanApplication> searchLoans(@Param("caseNumber") String caseNumber,
                                        @Param("name") String name);

    //report dashboard

    // ✅ Approval vs Rejection
    @Query("""
                SELECT new com.finserv.dto.reportDTO.MonthlyStatusDTO(
                    FUNCTION('DATE_FORMAT', l.createdDate, '%b'),
                    SUM(CASE WHEN l.status = com.finserv.enums.LoanStatus.APPROVED THEN 1 ELSE 0 END),
                    SUM(CASE WHEN l.status = com.finserv.enums.LoanStatus.REJECTED THEN 1 ELSE 0 END)
                )
                FROM LoanApplication l
                WHERE FUNCTION('YEAR', l.createdDate) = :year
                GROUP BY FUNCTION('MONTH', l.createdDate), FUNCTION('DATE_FORMAT', l.createdDate, '%b')
                ORDER BY FUNCTION('MONTH', l.createdDate)
            """)
    List<MonthlyStatusDTO> getApprovalVsRejection(int year);


    // ✅ Disbursement Volume
    @Query("""
                SELECT new com.finserv.dto.reportDTO.MonthlyDisbursementDTO(
                    FUNCTION('DATE_FORMAT', l.createdDate, '%b'),
                    SUM(l.loanAmount)
                )
                FROM LoanApplication l
                WHERE l.status = com.finserv.enums.LoanStatus.APPROVED
                  AND FUNCTION('YEAR', l.createdDate) = :year
                GROUP BY FUNCTION('MONTH', l.createdDate), FUNCTION('DATE_FORMAT', l.createdDate, '%b')
                ORDER BY FUNCTION('MONTH', l.createdDate)
            """)
    List<MonthlyDisbursementDTO> getMonthlyDisbursement(int year);

    // 3️⃣ Bank-wise Distribution
    @Query("""
                SELECT new com.finserv.dto.reportDTO.BankDistributionDTO(
                    b.bankName,
                    COUNT(l.id)
                )
                FROM LoanApplication l
                JOIN l.bank b
                GROUP BY b.bankName
            """)
    List<BankDistributionDTO> getBankDistribution();

    // 4️⃣ Turnaround Time
    @Query("""
                SELECT new com.finserv.dto.reportDTO.BankTurnaroundDTO(
                    b.bankName,
                    AVG(DATEDIFF(l.updatedDate, l.createdDate))
                )
                FROM LoanApplication l
                JOIN l.bank b
                WHERE l.updatedDate IS NOT NULL
                GROUP BY b.bankName
            """)
    List<BankTurnaroundDTO> getTurnaroundTime();

    //  Get by status
    List<LoanApplication> findByStatus(LoanStatus status);

    //  Get by case number
    LoanApplication findByCaseNumber(String caseNumber);

    // Get by case number and status
    @Query("""
                  SELECT l FROM LoanApplication l
                  WHERE l.caseNumber = :caseNumber
            AND l.status = :status
            AND l.isDeleted = false
            """)
    LoanApplication findByCaseNumberAndStatus(
            @Param("caseNumber") String caseNumber,
            @Param("status") LoanStatus status
    );
}

