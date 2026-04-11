package com.finserv.dto.reportDTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BankTurnaroundDTO {
    private String bankName;
    private Double avgDays;
}