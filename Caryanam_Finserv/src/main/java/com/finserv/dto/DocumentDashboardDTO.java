package com.finserv.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DocumentDashboardDTO {

    private String caseNumber;
    private String customerName;

    private Long totalDocuments;
    private Long verifiedCount;
    private Long pendingCount;
    private Long rejectedCount;

    private List<DocumentResponseDTO> documents;
}
