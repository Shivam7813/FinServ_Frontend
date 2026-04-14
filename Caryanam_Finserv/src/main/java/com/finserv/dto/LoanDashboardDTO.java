package com.finserv.dto;

import java.time.LocalDate;
import java.util.List;

import com.finserv.enums.LoanStatus;
import com.finserv.enums.LoanType;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class LoanDashboardDTO {

    private String customerName;
    private String caseNumber;
    private String mobile;
    private String vehicle;
    private Double amount;
    private String bank;
    private LoanStatus status;
    private LoanType loanType;
    private LocalDate createdDate;

    private List<String> missingDocuments;
    private List<String> pendingDocuments;

    private String adminRemark;

    // ✅ 1. BASIC (for JPQL / simple fetch)
    public LoanDashboardDTO(
            String caseNumber,
            String customerName,
            String mobile,
            String vehicle,
            Double amount,
            String bank,
            LoanStatus status,
            LoanType loanType,
            LocalDate createdDate
    ) {
        this.caseNumber = caseNumber;
        this.customerName = customerName;
        this.mobile = mobile;
        this.vehicle = vehicle;
        this.amount = amount;
        this.bank = bank;
        this.status = status;
        this.loanType = loanType;
        this.createdDate = createdDate;
    }

    // ✅ 2. FULL (USED IN SERVICE)
    public LoanDashboardDTO(
            String caseNumber,
            String customerName,
            String mobile,
            String vehicle,
            Double amount,
            String bank,
            LoanStatus status,
            LoanType loanType,
            LocalDate createdDate,
            List<String> missingDocuments,
            String adminRemark
    ) {
        this.caseNumber = caseNumber;
        this.customerName = customerName;
        this.mobile = mobile;
        this.vehicle = vehicle;
        this.amount = amount;
        this.bank = bank;
        this.status = status;
        this.loanType = loanType;
        this.createdDate = createdDate;
        this.missingDocuments = missingDocuments;
        this.adminRemark = adminRemark;
    }
}