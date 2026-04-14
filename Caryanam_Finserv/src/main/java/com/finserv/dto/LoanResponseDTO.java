package com.finserv.dto;


import java.time.LocalDate;

import lombok.Data;

@Data
public class LoanResponseDTO {
    private Long loanid;
    private String caseNumber;
    private String loanType;
    private Double loanAmount;
    private Double downPayment;
    private Integer tenure;
    private String status;
    private LocalDate createdDate;
    private String customerName;

}
