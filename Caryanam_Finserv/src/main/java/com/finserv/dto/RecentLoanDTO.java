package com.finserv.dto;

import com.finserv.enums.LoanStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data

public class RecentLoanDTO {

    private String caseNumber;
    private String customerName;
    private Double loanAmount;
    private LoanStatus status;
    private LocalDate lastUpdated;

    //  THIS CONSTRUCTOR IS REQUIRED
    public RecentLoanDTO(
            String caseNumber,
            String customerName,
            Double loanAmount,
            LoanStatus status,
            LocalDate lastUpdated
    ) {
        this.caseNumber = caseNumber;
        this.customerName = customerName;
        this.loanAmount = loanAmount;
        this.status = status;
        this.lastUpdated = lastUpdated;
    }
}