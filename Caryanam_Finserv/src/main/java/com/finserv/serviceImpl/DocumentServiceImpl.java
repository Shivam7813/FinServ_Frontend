package com.finserv.serviceImpl;

import com.finserv.dto.DocumentDashboardDTO;
import com.finserv.dto.DocumentResponseDTO;
import com.finserv.entity.Document;
import com.finserv.entity.LoanApplication;
import com.finserv.enums.DocumentStatus;
import com.finserv.enums.DocumentType;
import com.finserv.exception.BadRequestException;
import com.finserv.exception.ResourceNotFoundException;
import com.finserv.repository.DocumentRepository;
import com.finserv.repository.LoanApplicationRepository;
import com.finserv.service.DocumentService;

import io.jsonwebtoken.io.IOException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DocumentServiceImpl implements DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private LoanApplicationRepository loanRepo;

    // ✅ UPLOAD DOCUMENT

    @Transactional
    public DocumentResponseDTO upload(Long loanId, MultipartFile file, DocumentType type) {

        // 1️⃣ Validate Loan
        LoanApplication loan = loanRepo.findById(loanId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Loan not found with id: " + loanId));

        // 2️⃣ Validate Type
        if (type == null) {
            throw new BadRequestException("Document type is required");
        }

        // 3️⃣ Safe file name
        String original = Optional.ofNullable(file.getOriginalFilename())
                .orElse("file.pdf")
                .replaceAll("\\s+", "_");

        String fileName = System.currentTimeMillis() + "_" + original;

        // 4️⃣ Upload directory
        String uploadDir = System.getProperty("user.dir") + File.separator + "uploads" + File.separator;

        File folder = new File(uploadDir);
        if (!folder.exists()) {
            folder.mkdirs();
        }

        // 5️⃣ Destination
        File dest = new File(uploadDir + fileName);

        try {
            file.transferTo(dest);
        } catch (IOException | java.io.IOException e) {
            throw new RuntimeException("File upload failed: " + e.getMessage());
        }

        // 6️⃣ Check duplicate (update existing)
        Document document = documentRepository
                .findByLoanApplicationIdAndDocumentType(loanId, type)
                .orElse(new Document());

        // 7️⃣ Set values
        document.setDocumentType(type);
        document.setFileName(fileName);
        document.setFilePath(dest.getAbsolutePath());
        document.setStatus(DocumentStatus.PENDING);
        document.setUploadDate(LocalDate.now());
        document.setLoanApplication(loan);

        // (Optional but recommended)
        document.setFileSize(file.getSize());
        document.setContentType(file.getContentType());

        Document saved = documentRepository.save(document);

        return mapToDTO(saved);
    }

    // ✅ GET DOCUMENTS
    @Override
    @Transactional(readOnly = true)
    public List<DocumentResponseDTO> getDocuments(Long loanId) {

        return documentRepository.findByLoanApplicationId(loanId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ✅ COUNT DOCUMENTS
    @Override
    @Transactional(readOnly = true)
    public long getUploadedCount(Long loanId) {
        return documentRepository.countByLoanApplicationId(loanId);
    }

    // ✅ UPDATE STATUS
    @Override
    @Transactional
    public DocumentResponseDTO updateStatus(Long docId, String status) {

        // 1️⃣ Fetch document
        Document doc = documentRepository.findById(docId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Document not found with id: " + docId));

        // 2️⃣ Convert String → Enum
        DocumentStatus newStatus;
        try {
            newStatus = DocumentStatus.valueOf(status.toUpperCase());
        } catch (Exception e) {
            throw new BadRequestException("Invalid status: " + status);
        }

        // 3️⃣ Update
        doc.setStatus(newStatus);

        return mapToDTO(documentRepository.save(doc));
    }

    // ✅ DASHBOARD
    @Override
    @Transactional(readOnly = true)
    public List<DocumentDashboardDTO> getDashboard() {

        List<LoanApplication> loans = loanRepo.findAll();

        return loans.stream().map(loan -> {

            DocumentDashboardDTO dto = new DocumentDashboardDTO();

            dto.setCaseNumber(loan.getCaseNumber());

            // Customer Name
            if (loan.getUser() != null && loan.getUser().getPersonalDetails() != null) {
                dto.setCustomerName(
                        loan.getUser().getPersonalDetails().getFullName()
                );
            } else {
                dto.setCustomerName("Unknown");
            }

            // Documents
            List<Document> docs = loan.getDocuments();

            List<DocumentResponseDTO> docDTOs = docs.stream()
                    .map(this::mapToDTO)
                    .toList();

            dto.setDocuments(docDTOs);

            // Counts
            dto.setTotalDocuments((long) docs.size());

            dto.setVerifiedCount(
                    docs.stream()
                            .filter(d -> d.getStatus() == DocumentStatus.VERIFIED)
                            .count()
            );

            dto.setPendingCount(
                    docs.stream()
                            .filter(d -> d.getStatus() == DocumentStatus.PENDING)
                            .count()
            );

            dto.setRejectedCount(
                    docs.stream()
                            .filter(d -> d.getStatus() == DocumentStatus.REJECTED)
                            .count()
            );

            return dto;

        }).toList();
    }

    // 🔥 COMMON MAPPER METHOD
    private DocumentResponseDTO mapToDTO(Document doc) {

        DocumentResponseDTO dto = new DocumentResponseDTO();

        dto.setId(doc.getId());
        dto.setDocumentType(doc.getDocumentType());
        dto.setFileName(doc.getFileName());
        dto.setStatus(doc.getStatus());
        dto.setUploadDate(doc.getUploadDate());

        return dto;
    }
}