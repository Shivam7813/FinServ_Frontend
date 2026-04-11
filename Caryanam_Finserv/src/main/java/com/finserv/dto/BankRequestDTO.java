package com.finserv.dto;

import lombok.Data;
import java.util.List;

@Data
public class BankRequestDTO {

    private String bankName;
    private Double roiMin;
    private Double roiMax;
    private String processingDays;
    private Integer maxLtv;
    private Integer maxTenureMonths;
    private List<String> features;
}