package com.finserv.dto.reportDTO;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DashboardRequestDTO {

    @NotNull(message = "Year is required")
    @Min(value = 2000, message = "Year must be >= 2000")
    @Max(value = 2100, message = "Year must be <= 2100")
    private Integer year;
}