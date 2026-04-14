package com.finserv.dto;

import lombok.Data;

@Data
public class LoanRequestDTO {

    private String loanType;
    private Double loanAmount;
    private Double downPayment;
    private Integer tenure;
    private Long userId;
    private Long bankId;


    
}