package com.finserv.dto.reportDTO;

import lombok.Data;

@Data
public class MonthlyDisbursementDTO {

    private String month;
    private Double totalAmount;

    // ✅ FIXED constructor
    public MonthlyDisbursementDTO(Object month, Object totalAmount) {
        this.month = month != null ? month.toString() : null;
        this.totalAmount = totalAmount != null ? ((Number) totalAmount).doubleValue() : 0.0;
    }
}