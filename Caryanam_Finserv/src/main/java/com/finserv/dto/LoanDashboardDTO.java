package com.finserv.dto;

import com.finserv.enums.LoanStatus;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
public class LoanDashboardDTO {

    private String caseNumber;
    private String customerName;
    private String mobile;
    private String vehicle;
    private Double amount;
    private String bank;
    private LoanStatus status;
    private LocalDate createdDate;

    private List<String> missingDocuments;
    private List<String> pendingDocuments;

    // ✅ Constructor 1 (used in JPQL / projections)
    public LoanDashboardDTO(
            String caseNumber,
            String customerName,
            String mobile,
            String vehicle,
            Double amount,
            String bank,
            LoanStatus status,
            LocalDate createdDate
    ) {
        this.caseNumber = caseNumber;
        this.customerName = customerName;
        this.mobile = mobile;
        this.vehicle = vehicle;
        this.amount = amount;
        this.bank = bank;
        this.status = status;
        this.createdDate = createdDate;
    }

    // ✅ Constructor 2 (with missing documents)
    public LoanDashboardDTO(
            String caseNumber,
            String customerName,
            String mobile,
            String vehicle,
            Double amount,
            String bank,
            LoanStatus status,
            LocalDate createdDate,
            List<String> missingDocuments
    ) {
        this.caseNumber = caseNumber;
        this.customerName = customerName;
        this.mobile = mobile;
        this.vehicle = vehicle;
        this.amount = amount;
        this.bank = bank;
        this.status = status;
        this.createdDate = createdDate;
        this.missingDocuments = missingDocuments;
    }
}