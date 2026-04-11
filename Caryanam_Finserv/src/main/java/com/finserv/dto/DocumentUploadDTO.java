package com.finserv.dto;

import com.finserv.enums.DocumentType;
import lombok.Data;

@Data
public class DocumentUploadDTO {

    private Long loanId;
    private DocumentType type;
}