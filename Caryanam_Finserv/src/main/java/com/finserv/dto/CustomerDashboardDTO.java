package com.finserv.dto;

import lombok.Data;

@Data
public class CustomerDashboardDTO {

    private Long userId;

    private String fullName;

    private String email;

    private String mobileNumber;

    private String panNumber;

    private Long totalLoans;

    private Long activeLoans;

    private Double totalLoanAmount;

    //  Constructor for JPQL
    public CustomerDashboardDTO(
            Long userId,
            String fullName,
            String email,
            String mobileNumber,
            String panNumber,
            Long totalLoans,
            Long activeLoans,
            Double totalLoanAmount
    ) {
        this.userId = userId;
        this.fullName = fullName;
        this.email = email;
        this.mobileNumber = mobileNumber;
        this.panNumber = panNumber;
        this.totalLoans = totalLoans;
        this.activeLoans = activeLoans;
        this.totalLoanAmount = totalLoanAmount;
    }
}