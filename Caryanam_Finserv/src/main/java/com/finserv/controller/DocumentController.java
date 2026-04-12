package com.finserv.controller;

import com.finserv.dto.*;
import com.finserv.entity.Document;
import com.finserv.enums.DocumentType;
import com.finserv.exception.BadRequestException;
import com.finserv.repository.DocumentRepository;
import com.finserv.service.DocumentService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @Autowired
    private DocumentRepository documentRepository;

    // ✅ UPLOAD
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<DocumentResponseDTO> upload(
            @RequestParam("loanId") Long loanId,
            @RequestParam("type") DocumentType type,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam(value = "base64", required = false) String base64) {

        if (loanId == null || loanId <= 0) {
            throw new BadRequestException("Invalid loan ID");
        }

        if (type == null) {
            throw new BadRequestException("Document type is required");
        }

        // ❌ both null
        if ((file == null || file.isEmpty()) && (base64 == null || base64.isBlank())) {
            throw new BadRequestException("Either file or base64 must be provided");
        }

        // ❌ both provided
        if (file != null && !file.isEmpty() && base64 != null && !base64.isBlank()) {
            throw new BadRequestException("Send either file OR base64, not both");
        }

        // ✅ file validation (if file used)
        if (file != null && !file.isEmpty()) {
            if (file.getOriginalFilename() == null || file.getOriginalFilename().isBlank()) {
                throw new BadRequestException("File name is missing");
            }

            if (file.getSize() > 5 * 1024 * 1024) { // 5MB limit
                throw new BadRequestException("File size must be less than 5MB");
            }
        }

        // ✅ base64 validation (basic)
        if (base64 != null && !base64.isBlank()) {
            if (base64.length() < 20) {
                throw new BadRequestException("Invalid base64 content");
            }
        }

        return ResponseEntity.ok(
                documentService.uploadUnified(loanId, file, base64, type)
        );
    }

    // ✅ GET DOCUMENTS
    @PostMapping("/loan")
    public ResponseEntity<?> getDocuments(@Valid @RequestBody IdRequestDTO request) {

        if (request.getUserid() == null || request.getUserid() <= 0) {
            throw new BadRequestException("Invalid loan ID");
        }

        return ResponseEntity.ok(
                documentService.getDocuments(request.getUserid())
        );
    }

    // ✅ COUNT
    @PostMapping("/count")
    public ResponseEntity<?> getCount(@Valid @RequestBody IdRequestDTO request) {

        if (request.getUserid() == null || request.getUserid() <= 0) {
            throw new BadRequestException("Invalid loan ID");
        }

        return ResponseEntity.ok(
                documentService.getUploadedCount(request.getUserid())
        );
    }

    // ✅ UPDATE STATUS
    @PutMapping("/status")
    public ResponseEntity<?> updateStatus(@Valid @RequestBody DocumentStatusDTO request) {

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

    // ✅ DASHBOARD
    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard() {
        return ResponseEntity.ok(documentService.getDashboard());
    }

    // ✅ PREVIEW
    @GetMapping("/preview/{id}")
    public ResponseEntity<byte[]> preview(@PathVariable Long id) {

        if (id == null || id <= 0) {
            throw new BadRequestException("Invalid document ID");
        }

        Document doc = documentRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Document not found"));

        String contentType = doc.getContentType();

        MediaType mediaType;

        if (contentType == null || contentType.isBlank()) {
            mediaType = MediaType.APPLICATION_PDF;
        } else {
            mediaType = MediaType.parseMediaType(contentType);
        }

        return ResponseEntity.ok()
                .header("Content-Disposition", "inline; filename=" + doc.getFileName())
                .contentType(mediaType)
                .body(doc.getFileData());
    }
}