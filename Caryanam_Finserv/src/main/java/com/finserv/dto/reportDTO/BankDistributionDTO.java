package com.finserv.dto.reportDTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BankDistributionDTO {
    private String bankName;
    private Long count;
}