//package com.finserv.serviceImpl;
//
//import com.finserv.dto.DocumentDashboardDTO;
//import com.finserv.dto.DocumentResponseDTO;
//import com.finserv.dto.DownloadResult;
//import com.finserv.entity.Document;
//import com.finserv.entity.LoanApplication;
//import com.finserv.enums.DocumentStatus;
//import com.finserv.enums.DocumentType;
//import com.finserv.exception.BadRequestException;
//import com.finserv.exception.ResourceNotFoundException;
//import com.finserv.repository.DocumentRepository;
//import com.finserv.repository.LoanApplicationRepository;
//import com.finserv.service.DocumentService;
//
//import io.jsonwebtoken.io.IOException;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.MediaType;
//import org.springframework.http.ResponseEntity;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.io.ByteArrayOutputStream;
//import java.io.File;
//import java.io.FileOutputStream;
//import java.nio.file.Files;
//import java.nio.file.Path;
//import java.nio.file.Paths;
//import java.time.LocalDate;
//import java.util.*;
//import java.util.stream.Collectors;
//import java.util.zip.ZipEntry;
//import java.util.zip.ZipOutputStream;
//
//@Service
//public class DocumentServiceImpl implements DocumentService {
//
//    @Autowired
//    private DocumentRepository documentRepository;
//
//    @Autowired
//    private LoanApplicationRepository loanRepo;
//
//    // ✅ UPLOAD DOCUMENT
//    @Transactional
//    public DocumentResponseDTO upload(Long loanId, MultipartFile file, DocumentType type) {
//
//        // 1️⃣ Validate Loan
//        LoanApplication loan = loanRepo.findById(loanId)
//                .orElseThrow(() ->
//                        new RuntimeException("Loan not found with id: " + loanId));
//
//        // 2️⃣ Validate Type
//        if (type == null) {
//            throw new RuntimeException("Document type is required");
//        }
//
//        // 3️⃣ Safe file name
//        String original = Optional.ofNullable(file.getOriginalFilename())
//                .orElse("file.jpg")
//                .replaceAll("\\s+", "_");
//
//        String fileName = System.currentTimeMillis() + "_" + original;
//
//        // 4️⃣ Check duplicate
//        Document document = documentRepository
//                .findByLoanApplicationIdAndDocumentType(loanId, type)
//                .orElse(new Document());
//
//        try {
//            // ✅ Store file as byte[]
//            byte[] fileBytes = file.getBytes();
//            document.setFileData(fileBytes);
//
//            // Optional (still keep metadata)
//            document.setFileName(fileName);
//            document.setDocumentType(type);
//            document.setLoanApplication(loan);
//            document.setStatus(DocumentStatus.VERIFIED);
//            document.setUploadDate(LocalDate.now());
//            document.setFileSize(file.getSize());
//            document.setContentType(file.getContentType());
//
//            Document saved = documentRepository.save(document);
//
//            // 5️⃣ Convert to Base64 for preview
//            DocumentResponseDTO dto = new DocumentResponseDTO();
//            dto.setId(saved.getId());
//            dto.setDocumentType(DocumentType.valueOf(saved.getDocumentType().name()));
//            dto.setFileName(Arrays.toString(saved.getFileName()));
//
//            if (saved.getFileData() != null) {
//                dto.set(Base64.getEncoder().encodeToString(saved.getFileData()));
//            } else {
//                dto.setImage(null);
//            }
//
//            return dto;
//
//        } catch (IOException | java.io.IOException e) {
//            throw new RuntimeException("File upload failed: " + e.getMessage());
//        }
//    }
//
//    // ✅ GET DOCUMENTS
//    @Override
//    @Transactional(readOnly = true)
//    public List<DocumentResponseDTO> getDocuments(Long loanId) {
//
//        return documentRepository.findByLoanApplicationId(loanId)
//                .stream()
//                .map(this::mapToDTO)
//                .collect(Collectors.toList());
//    }
//
//    // ✅ COUNT DOCUMENTS
//    @Override
//    @Transactional(readOnly = true)
//    public long getUploadedCount(Long loanId) {
//        return documentRepository.countByLoanApplicationId(loanId);
//    }
//
//    // ✅ UPDATE STATUS
//    @Override
//    @Transactional
//    public DocumentResponseDTO updateStatus(Long docId, String status) {
//
//        // 1️⃣ Fetch document
//        Document doc = documentRepository.findById(docId)
//                .orElseThrow(() ->
//                        new ResourceNotFoundException("Document not found with id: " + docId));
//
//        // 2️⃣ Convert String → Enum
//        DocumentStatus newStatus;
//        try {
//            newStatus = DocumentStatus.valueOf(status.toUpperCase());
//        } catch (Exception e) {
//            throw new BadRequestException("Invalid status: " + status);
//        }
//
//        // 3️⃣ Update
//        doc.setStatus(newStatus);
//
//        return mapToDTO(documentRepository.save(doc));
//    }
//
//    // ✅ DASHBOARD
//    @Override
//    @Transactional(readOnly = true)
//    public List<DocumentDashboardDTO> getDashboard() {
//
//        List<LoanApplication> loans = loanRepo.findAll();
//
//        return loans.stream().map(loan -> {
//
//            DocumentDashboardDTO dto = new DocumentDashboardDTO();
//
//            dto.setCaseNumber(loan.getCaseNumber());
//
//            // Customer Name
//            if (loan.getUser() != null && loan.getUser().getPersonalDetails() != null) {
//                dto.setCustomerName(
//                        loan.getUser().getPersonalDetails().getFullName()
//                );
//            } else {
//                dto.setCustomerName("Unknown");
//            }
//
//            // Documents
//            List<Document> docs = loan.getDocuments();
//
//            List<DocumentResponseDTO> docDTOs = docs.stream()
//                    .map(this::mapToDTO)
//                    .toList();
//
//            dto.setDocuments(docDTOs);
//
//            // Counts
//            dto.setTotalDocuments((long) docs.size());
//
//            dto.setVerifiedCount(
//                    docs.stream()
//                            .filter(d -> d.getStatus() == DocumentStatus.VERIFIED)
//                            .count()
//            );
//
//            dto.setPendingCount(
//                    docs.stream()
//                            .filter(d -> d.getStatus() == DocumentStatus.PENDING)
//                            .count()
//            );
//
//            dto.setRejectedCount(
//                    docs.stream()
//                            .filter(d -> d.getStatus() == DocumentStatus.REJECTED)
//                            .count()
//            );
//
//            return dto;
//
//        }).toList();
//    }
//
//    @Override
//    public DownloadResult processDocuments(Long userId) {
//
//        List<Document> documents =
//                documentRepository.findByLoanApplication_User_Id(userId);
//
//        if (documents == null || documents.isEmpty()) {
//            throw new RuntimeException("No documents found");
//        }
//
//        String fileName = "user-" + userId + "-documents.zip";
//        String filePath = "C:\\Users\\MSI\\Desktop\\postman\\downloads" + fileName;
//
//        ByteArrayOutputStream baos = new ByteArrayOutputStream();
//
//        int fileCount = 0;
//
//        try (ZipOutputStream zipOut1 = new ZipOutputStream(new FileOutputStream(filePath));
//             ZipOutputStream zipOut2 = new ZipOutputStream(baos)) {
//
//            for (Document doc : documents) {
//
//                if (doc.getFilePath() == null) continue;
//
//                Path path = Paths.get(doc.getFilePath());
//                if (!Files.exists(path)) continue;
//
//                byte[] fileBytes = Files.readAllBytes(path);
//
//                // 👉 Save to file
//                zipOut1.putNextEntry(new ZipEntry(Arrays.toString(doc.getFileName())));
//                zipOut1.write(fileBytes);
//                zipOut1.closeEntry();
//
//                // 👉 Prepare for download
//                zipOut2.putNextEntry(new ZipEntry(Arrays.toString(doc.getFileName())));
//                zipOut2.write(fileBytes);
//                zipOut2.closeEntry();
//
//                fileCount++;
//            }
//
//        } catch (Exception e) {
//            throw new RuntimeException("Error processing ZIP");
//        }
//
//        if (fileCount == 0) {
//            throw new RuntimeException("No valid files found");
//        }
//
//        return new DownloadResult(fileName, baos.toByteArray(), fileCount);
//    }
//    // 🔥 COMMON MAPPER METHOD
//    private DocumentResponseDTO mapToDTO(Document doc) {
//
//        DocumentResponseDTO dto = new DocumentResponseDTO();
//
//        dto.setId(doc.getId());
//        dto.setDocumentType(doc.getDocumentType());
//        dto.setFileName(Arrays.toString(doc.getFileName()));
//        dto.setStatus(doc.getStatus());
//        dto.setUploadDate(doc.getUploadDate());
//
//        return dto;
//    }
//}

package com.finserv.serviceImpl;

import com.finserv.dto.DocumentDashboardDTO;
import com.finserv.dto.DocumentResponseDTO;
import com.finserv.dto.DownloadResult;
import com.finserv.entity.Document;
import com.finserv.entity.LoanApplication;
import com.finserv.enums.DocumentStatus;
import com.finserv.enums.DocumentType;
import com.finserv.exception.BadRequestException;
import com.finserv.exception.ResourceNotFoundException;
import com.finserv.repository.DocumentRepository;
import com.finserv.repository.LoanApplicationRepository;
import com.finserv.service.DocumentService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.*;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service
public class DocumentServiceImpl implements DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private LoanApplicationRepository loanRepo;

    // ================== UPLOAD ==================
//    @Transactional
//    public DocumentResponseDTO upload(Long loanId, MultipartFile file, DocumentType type) {
//
//        LoanApplication loan = loanRepo.findById(loanId)
//                .orElseThrow(() ->
//                        new RuntimeException("Loan not found with id: " + loanId));
//
//        if (type == null) {
//            throw new RuntimeException("Document type is required");
//        }
//
//        String original = Optional.ofNullable(file.getOriginalFilename())
//                .orElse("file.jpg")
//                .replaceAll("\\s+", "_");
//
//        String fileName = System.currentTimeMillis() + "_" + original;
//
//        Document document = documentRepository
//                .findByLoanApplicationIdAndDocumentType(loanId, type)
//                .orElse(new Document());
//
//        try {
//            byte[] fileBytes = file.getBytes();
//
//            document.setFileData(fileBytes);
//            document.setFileName(fileName);
//            document.setDocumentType(type);
//            document.setLoanApplication(loan);
//            document.setStatus(DocumentStatus.VERIFIED);
//            document.setUploadDate(LocalDate.now());
//            document.setFileSize(file.getSize());
//            document.setContentType(file.getContentType());
//
//            Document saved = documentRepository.save(document);
//
//            return mapToDTO(saved);
//
//        } catch (IOException e) {
//            throw new RuntimeException("File upload failed: " + e.getMessage());
//        }
//    }
    @Transactional
    public DocumentResponseDTO uploadUnified(
            Long loanId,
            MultipartFile file,
            String base64,
            DocumentType type) {

        LoanApplication loan = loanRepo.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        Document document = documentRepository
                .findByLoanApplicationIdAndDocumentType(loanId, type)
                .orElse(new Document());

        try {
            byte[] fileBytes;
            String fileName;

            // ================== FILE UPLOAD ==================
            if (file != null && !file.isEmpty()) {

                fileBytes = file.getBytes();

                String original = Optional.ofNullable(file.getOriginalFilename())
                        .orElse("file.jpg")
                        .replaceAll("\\s+", "_");

                fileName = System.currentTimeMillis() + "_" + original;
            }

            // ================== BASE64 UPLOAD ==================
            else {

                // remove prefix if exists
                if (base64.contains(",")) {
                    base64 = base64.split(",")[1];
                }

                fileBytes = Base64.getDecoder().decode(base64);
                fileName = "base64_" + System.currentTimeMillis();
            }

            // ================== SAVE ==================
            document.setFileData(fileBytes);
            document.setFileName(fileName);
            document.setDocumentType(type);
            document.setLoanApplication(loan);
            document.setStatus(DocumentStatus.VERIFIED);
            document.setUploadDate(LocalDate.now());

            Document saved = documentRepository.save(document);

            return mapToDTO(saved);

        } catch (Exception e) {
            throw new RuntimeException("Upload failed: " + e.getMessage());
        }
    }




    // ================== GET DOCUMENTS ==================
    @Override
    @Transactional(readOnly = true)
    public List<DocumentResponseDTO> getDocuments(Long loanId) {

        return documentRepository.findByLoanApplicationId(loanId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ================== COUNT ==================
    @Override
    @Transactional(readOnly = true)
    public long getUploadedCount(Long loanId) {
        return documentRepository.countByLoanApplicationId(loanId);
    }

    // ================== UPDATE STATUS ==================
    @Override
    @Transactional
    public DocumentResponseDTO updateStatus(Long docId, String status) {

        Document doc = documentRepository.findById(docId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Document not found with id: " + docId));

        DocumentStatus newStatus;

        try {
            newStatus = DocumentStatus.valueOf(status.toUpperCase());
        } catch (Exception e) {
            throw new BadRequestException("Invalid status: " + status);
        }

        doc.setStatus(newStatus);

        return mapToDTO(documentRepository.save(doc));
    }

    // ================== DASHBOARD ==================
    @Override
    @Transactional(readOnly = true)
    public List<DocumentDashboardDTO> getDashboard() {

        List<LoanApplication> loans = loanRepo.findAll();

        return loans.stream().map(loan -> {

            DocumentDashboardDTO dto = new DocumentDashboardDTO();

            dto.setCaseNumber(loan.getCaseNumber());

            if (loan.getUser() != null && loan.getUser().getPersonalDetails() != null) {
                dto.setCustomerName(
                        loan.getUser().getPersonalDetails().getFullName()
                );
            } else {
                dto.setCustomerName("Unknown");
            }

            List<Document> docs = loan.getDocuments();

            List<DocumentResponseDTO> docDTOs = docs.stream()
                    .map(this::mapToDTO)
                    .toList();

            dto.setDocuments(docDTOs);

            dto.setTotalDocuments((long) docs.size());

            dto.setVerifiedCount(
                    docs.stream().filter(d -> d.getStatus() == DocumentStatus.VERIFIED).count()
            );

            dto.setPendingCount(
                    docs.stream().filter(d -> d.getStatus() == DocumentStatus.PENDING).count()
            );

            dto.setRejectedCount(
                    docs.stream().filter(d -> d.getStatus() == DocumentStatus.REJECTED).count()
            );

            return dto;

        }).toList();
    }

    // ================== DOWNLOAD ZIP ==================
    @Override
    public DownloadResult processDocuments(Long userId) {

        List<Document> documents =
                documentRepository.findByLoanApplication_User_Id(userId);

        if (documents == null || documents.isEmpty()) {
            throw new RuntimeException("No documents found");
        }

        String fileName = "user-" + userId + "-documents.zip";

        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        int fileCount = 0;

        try (ZipOutputStream zipOut = new ZipOutputStream(baos)) {

            for (Document doc : documents) {

                if (doc.getFileData() == null) continue;

                zipOut.putNextEntry(new ZipEntry(doc.getFileName()));
                zipOut.write(doc.getFileData());
                zipOut.closeEntry();

                fileCount++;
            }

        } catch (Exception e) {
            throw new RuntimeException("Error processing ZIP");
        }

        if (fileCount == 0) {
            throw new RuntimeException("No valid files found");
        }

        return new DownloadResult(fileName, baos.toByteArray(), fileCount);
    }

    // ================== COMMON MAPPER ==================
    private DocumentResponseDTO mapToDTO(Document doc) {

        DocumentResponseDTO dto = new DocumentResponseDTO();

        dto.setId(doc.getId());
        dto.setDocumentType(doc.getDocumentType());
        dto.setFileName(doc.getFileName());
        dto.setStatus(doc.getStatus());
        dto.setUploadDate(doc.getUploadDate());

        if (doc.getFileData() != null) {
            dto.setImage(Base64.getEncoder().encodeToString(doc.getFileData()));
        }

        return dto;
    }

}