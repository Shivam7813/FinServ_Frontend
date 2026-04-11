package com.finserv.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.*;

import java.util.List;

@Data
@NoArgsConstructor
public class BankDashboardDTO {

    @NotNull
    private Long bankId;

    @NotBlank
    private String bankName;

    @NotBlank
    private String status;

    @NotNull
    @Positive
    private Double roiMin;

    @NotNull
    @Positive
    private Double roiMax;

    @NotBlank
    private String processingDays;

    @NotNull
    @Min(0)
    @Max(100)
    private Integer maxLtv;

    @NotNull
    @Positive
    private Integer maxTenureMonths;

    private List<String> features;

    @NotNull
    @Min(0)
    private Long casesThisMonth;

    public BankDashboardDTO(
            Long bankId,
            String bankName,
            String status,
            Double roiMin,
            Double roiMax,
            String processingDays,
            Integer maxLtv,
            Integer maxTenureMonths,
            Long casesThisMonth
    ) {
        this.bankId = bankId;
        this.bankName = bankName;
        this.status = status;
        this.roiMin = roiMin;
        this.roiMax = roiMax;
        this.processingDays = processingDays;
        this.maxLtv = maxLtv;
        this.maxTenureMonths = maxTenureMonths;
        this.casesThisMonth = casesThisMonth;
    }
}