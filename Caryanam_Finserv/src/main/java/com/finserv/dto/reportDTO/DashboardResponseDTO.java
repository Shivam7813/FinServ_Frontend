package com.finserv.dto.reportDTO;

import lombok.Data;

import java.util.List;

@Data
public class DashboardResponseDTO {

    private List<MonthlyStatusDTO> approvalVsRejection;
    private List<MonthlyDisbursementDTO> disbursement;
    private List<BankDistributionDTO> bankDistribution;
    private List<BankTurnaroundDTO> turnaroundTime;
}