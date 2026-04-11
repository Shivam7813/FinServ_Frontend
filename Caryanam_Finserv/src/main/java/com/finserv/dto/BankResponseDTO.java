package com.finserv.dto;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class BankResponseDTO {

    private Long id;

    private String bankName;

    //  Example: "8.5% - 10.5%"
    private String roiRange;

    private String processingDays;

    private Integer maxLtv;

    private Integer maxTenureMonths;

    //  Null-safe
    private List<String> features = new ArrayList<>();

    private Integer casesThisMonth;

    private String status;
}