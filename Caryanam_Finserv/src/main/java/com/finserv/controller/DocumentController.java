package com.finserv.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource; // ✅ ADDED
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.multipart.MultipartFile;

import com.finserv.dto.DocumentResponseDTO;
import com.finserv.dto.DocumentStatusDTO;
import com.finserv.dto.IdRequestDTO;
import com.finserv.enums.DocumentType;
import com.finserv.exception.BadRequestException;
import com.finserv.service.DocumentService;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    // ✅ ================= PREVIEW API ADDED =================
    @GetMapping("/preview/{id}")
    public ResponseEntity<Resource> previewDocument(@PathVariable Long id) {

        if (id == null || id <= 0) {
            throw new BadRequestException("Invalid document ID");
        }

        return documentService.previewDocument(id);
    }
    // ✅ ====================================================

    // ✅ UPLOAD (BODY + FILE)
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<DocumentResponseDTO> upload(
            @RequestParam("loanId") Long loanId,
            @RequestParam("type") DocumentType type,
            @RequestParam("file") MultipartFile file) {

        // 1️⃣ Loan validation
        if (loanId == null || loanId <= 0) {
            throw new BadRequestException("Invalid loan ID");
        }

        // 2️⃣ File validations
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("File is required");
        }

        if (file.getOriginalFilename() == null || file.getOriginalFilename().isBlank()) {
            throw new BadRequestException("File name is invalid");
        }

        if (!"application/pdf".equalsIgnoreCase(file.getContentType())) {
            throw new BadRequestException("Only PDF files allowed");
        }

        if (!file.getOriginalFilename().toLowerCase().endsWith(".pdf")) {
            throw new BadRequestException("File must have .pdf extension");
        }

        if (file.getSize() > 5 * 1024 * 1024) {
            throw new BadRequestException("Max file size is 5MB");
        }

        // 3️⃣ Type validation
        if (type == null) {
            throw new BadRequestException("Document type is required");
        }

        // 4️⃣ Call service
        DocumentResponseDTO response = documentService.upload(
                loanId,
                file,
                type
        );

        return ResponseEntity.ok(response);
    }

    // ✅ GET DOCUMENTS (BODY)
    @PostMapping("/loan")
    public ResponseEntity<?> getDocuments(@RequestBody IdRequestDTO request) {

        if (request.getId() == null || request.getId() <= 0) {
            throw new BadRequestException("Invalid loan ID");
        }

        return ResponseEntity.ok(
                documentService.getDocuments(request.getId())
        );
    }

    // ✅ COUNT (BODY)
    @PostMapping("/count")
    public ResponseEntity<?> getCount(@RequestBody IdRequestDTO request) {

        if (request.getId() == null || request.getId() <= 0) {
            throw new BadRequestException("Invalid loan ID");
        }

        return ResponseEntity.ok(
                documentService.getUploadedCount(request.getId())
        );
    }

    // ✅ UPDATE STATUS (BODY)
    @PutMapping("/status")
    public ResponseEntity<?> updateStatus(@RequestBody DocumentStatusDTO request) {

        if (request.getDocId() == null || request.getDocId() <= 0) {
            throw new BadRequestException("Invalid document ID");
        }

        if (request.getStatus() == null || request.getStatus().isBlank()) {
            throw new BadRequestException("Status is required");
        }

        if (!request.getStatus().matches("^(PENDING|APPROVED|REJECTED)$")) {
            throw new BadRequestException("Status must be PENDING, APPROVED, REJECTED");
        }

        return ResponseEntity.ok(
                documentService.updateStatus(
                        request.getDocId(),
                        request.getStatus()
                )
        );
    }

    // ✅ DASHBOARD (NO CHANGE NEEDED)
    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard() {
        return ResponseEntity.ok(documentService.getDashboard());
    }
}