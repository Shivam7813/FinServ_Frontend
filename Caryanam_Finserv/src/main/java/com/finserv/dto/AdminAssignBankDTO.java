package com.finserv.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AdminAssignBankDTO {

    @NotBlank(message = "Case number is required")
    private String caseNumber;

    @NotNull(message = "Bank is required")
    private Long bankId;
}
