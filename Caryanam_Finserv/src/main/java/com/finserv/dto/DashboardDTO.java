package com.finserv.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class DashboardDTO {

    // KPI Cards
    private Long activeLoanCases;
    private Long pendingDocuments;
    private Long approvedToday;
    private Double disbursedThisMonth;

    // Recent Cases
    private List<RecentLoanDTO> recentLoans;
}
