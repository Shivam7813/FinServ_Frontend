package com.finserv.dto;

import com.finserv.enums.LoanStatus;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

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

    //  EXACT MATCH CONSTRUCTOR (VERY IMPORTANT)
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
}