package com.finserv.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AdminRejectDTO {

    @NotBlank(message = "Case number is required")
    private String caseNumber;

    @NotBlank(message = "Remark is required")
    private String remark;
}
