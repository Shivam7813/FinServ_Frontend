package com.finserv.dto.reportDTO;

import lombok.Data;

@Data
public class MonthlyStatusDTO {

    private String month;
    private Long approved;
    private Long rejected;

    // ✅ Bulletproof constructor
    public MonthlyStatusDTO(Object month, Object approved, Object rejected) {
        this.month = month != null ? month.toString() : null;
        this.approved = approved != null ? ((Number) approved).longValue() : 0L;
        this.rejected = rejected != null ? ((Number) rejected).longValue() : 0L;
    }
}