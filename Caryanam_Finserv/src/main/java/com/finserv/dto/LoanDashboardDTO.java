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

    /** Admin rejection remark (if status is REJECTED_BY_ADMIN) */
    private String adminRemark;

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

    // ✅ Dashboard list (includes admin remark)
    public LoanDashboardDTO(
            String caseNumber,
            String customerName,
            String mobile,
            String vehicle,
            Double amount,
            String bank,
            LoanStatus status,
            LocalDate createdDate,
            String adminRemark
    ) {
        this.caseNumber = caseNumber;
        this.customerName = customerName;
        this.mobile = mobile;
        this.vehicle = vehicle;
        this.amount = amount;
        this.bank = bank;
        this.status = status;
        this.createdDate = createdDate;
        this.adminRemark = adminRemark;
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

    // ✅ Search / detail (missing docs + admin remark)
    public LoanDashboardDTO(
            String caseNumber,
            String customerName,
            String mobile,
            String vehicle,
            Double amount,
            String bank,
            LoanStatus status,
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
        this.createdDate = createdDate;
        this.missingDocuments = missingDocuments;
        this.adminRemark = adminRemark;
    }
}