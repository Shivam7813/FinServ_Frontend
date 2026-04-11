package com.finserv.service;

import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile; // ✅ ADDED

import com.finserv.dto.DocumentDashboardDTO; // ✅ ADDED
import com.finserv.dto.DocumentResponseDTO;
import com.finserv.enums.DocumentType;

public interface DocumentService {

    // Upload document
    DocumentResponseDTO upload(Long loanId, MultipartFile file, DocumentType documentType);

    // Get all documents for a loan
    List<DocumentResponseDTO> getDocuments(Long loanId);

    // Count uploaded documents
    long getUploadedCount(Long loanId);

    // Update document status
    DocumentResponseDTO updateStatus(Long docId, String status);

    // Dashboard
    List<DocumentDashboardDTO> getDashboard();

    // ✅ ================= PREVIEW METHOD ADDED =================
    ResponseEntity<Resource> previewDocument(Long id);
    // ✅ =======================================================
}