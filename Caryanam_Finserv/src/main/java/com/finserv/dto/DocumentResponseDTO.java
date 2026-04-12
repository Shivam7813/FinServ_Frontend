package com.finserv.dto;

import com.finserv.enums.DocumentStatus;
import com.finserv.enums.DocumentType;
import lombok.Data;

import java.time.LocalDate;

@Data
public class DocumentResponseDTO {

    private Long id;
    private DocumentType documentType;
    private String fileName;
    private DocumentStatus status;
    private LocalDate uploadDate;
    private String base64;
    private String image; // Base64
}
