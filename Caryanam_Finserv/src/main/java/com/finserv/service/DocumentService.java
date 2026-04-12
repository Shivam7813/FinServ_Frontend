package com.finserv.service;

import com.finserv.dto.DocumentDashboardDTO;
import com.finserv.dto.DocumentResponseDTO;
import com.finserv.dto.DownloadResult;
import com.finserv.enums.DocumentType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface DocumentService {
    // Upload document
    DocumentResponseDTO uploadUnified(Long loanId, MultipartFile file,String base64, DocumentType documentType);

    // Get all documents for a loan
    List<DocumentResponseDTO> getDocuments(Long loanId);

    // Count uploaded documents
    long getUploadedCount(Long loanId);

    // Update document status
    DocumentResponseDTO updateStatus(Long docId, String status);

    List<DocumentDashboardDTO> getDashboard();

    // 🔥 Process documents (save + prepare download)
    DownloadResult processDocuments(Long userId);

    //Object uploadUnified(Long loanId, MultipartFile file, String base64, DocumentType type);
}
