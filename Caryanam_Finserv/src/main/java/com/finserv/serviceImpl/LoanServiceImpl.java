package com.finserv.serviceImpl;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.EnumSet;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.finserv.dto.LoanDashboardDTO;
import com.finserv.dto.LoanRequestDTO;
import com.finserv.dto.LoanResponseDTO;
import com.finserv.dto.PendingDocumentDTO;
import com.finserv.emailservice.EmailService;
import com.finserv.entity.Bank;
import com.finserv.entity.Document;
import com.finserv.entity.LoanApplication;
import com.finserv.entity.User;
import com.finserv.enums.DocumentStatus;
import com.finserv.enums.DocumentType;
import com.finserv.enums.LoanStatus;
import com.finserv.enums.LoanType;
import com.finserv.repository.BankRepository;
import com.finserv.repository.DocumentRepository;
import com.finserv.repository.LoanApplicationRepository;
import com.finserv.repository.UserRepository;
import com.finserv.service.LoanService;

@Service
public class LoanServiceImpl implements LoanService {

    private static final Set<LoanStatus> ADMIN_PRE_BANK_STATUSES = Collections.unmodifiableSet(EnumSet.of(
        LoanStatus.PENDING,
        LoanStatus.UNDER_REVIEW,
        LoanStatus.DOCUMENTS_PENDING,
        LoanStatus.SUBMITTED_TO_BANK,   
        LoanStatus.ASSIGNED_TO_BANK     
));

    @Autowired
    private LoanApplicationRepository loanRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private BankRepository bankRepo;

    @Autowired
    private EmailService emailService;

    @Autowired
    private DocumentRepository documentRepository;

    @Transactional
    @Override
    public LoanResponseDTO createLoan(LoanRequestDTO dto) {

        User user = userRepo.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Bank bank = bankRepo.findById(dto.getBankId())
                .orElseThrow(() -> new RuntimeException("Bank not found"));
        LoanType loanType;
        try {
            loanType = LoanType.valueOf(dto.getLoanType().toUpperCase());
        } catch (Exception e) {
            throw new RuntimeException("Invalid loan type");
        }

        LoanApplication loan = new LoanApplication();
        loan.setLoanType(loanType);
        loan.setLoanAmount(dto.getLoanAmount());
        loan.setDownPayment(dto.getDownPayment());
        loan.setTenure(dto.getTenure());
        loan.setStatus(LoanStatus.PENDING);
        loan.setCreatedDate(LocalDate.now());
        loan.setBank(bank);
        loan.setCaseNumber("LOAN-" + System.currentTimeMillis());
        loan.setUser(user);

        LoanApplication saved = loanRepo.save(loan);

        // SEND MAIL AFTER CREATE
        String subject = "Loan Application Created Successfully";
        String body = "Dear Customer,\n\n"
                + "Your loan application has been created successfully.\n"
                + "Case Number: " + saved.getCaseNumber() + "\n"
                + "Loan Type: " + saved.getLoanType() + "\n"
                + "Amount: " + saved.getLoanAmount() + "\n"
                + "Status: " + saved.getStatus() + "\n\n"
                + "Thank you.";

        emailService.sendEmail(user.getEmail(), subject, body);

        LoanResponseDTO response = new LoanResponseDTO();
        response.setLoanid(saved.getId());
        response.setCaseNumber(saved.getCaseNumber());
        response.setLoanType(saved.getLoanType().name());
        response.setLoanAmount(saved.getLoanAmount());
        response.setDownPayment(saved.getDownPayment());
        response.setTenure(saved.getTenure());
        response.setStatus(saved.getStatus().name());
        response.setCreatedDate(saved.getCreatedDate());

        return response;
    }

    @Override
    public List<LoanDashboardDTO> getAllLoans() {

        return loanRepo.getAllLoanCases();
    }

    @Override
    public List<LoanDashboardDTO> searchLoans(String caseNumber, String name) {

        List<LoanApplication> loans = loanRepo.searchLoans(caseNumber, name);
        List<LoanDashboardDTO> result = new ArrayList<>();

        for (LoanApplication l : loans) {

            String fullName = "";
            if (l.getUser() != null && l.getUser().getPersonalDetails() != null) {
                fullName = l.getUser().getPersonalDetails().getFullName();
            }

            String mobile = "";
            if (l.getUser() != null) {
                mobile = l.getUser().getMobileNumber();
            }

            String vehicle = "";
            if (l.getVehicle() != null) {
                vehicle = l.getVehicle().getCarMake() + " " + l.getVehicle().getModel();
            }

            String bankName = "";
            if (l.getBank() != null) {
                bankName = l.getBank().getBankName();
            }

            // ✅ Get uploaded documents
            List<Document> uploadedDocs = documentRepository.findByLoanApplication(l);

            Set<DocumentType> uploadedTypes = new HashSet<>();
            for (Document doc : uploadedDocs) {
                uploadedTypes.add(doc.getDocumentType());
            }

            DocumentType[] allDocs = DocumentType.values();

            List<String> missingDocuments = new ArrayList<>();
            for (DocumentType docType : allDocs) {
                if (!uploadedTypes.contains(docType)) {
                    missingDocuments.add(docType.name());
                }
            }

            LoanDashboardDTO dto = new LoanDashboardDTO(
                    l.getCaseNumber(),
                    fullName,
                    mobile,
                    vehicle,
                    l.getLoanAmount(),
                    bankName,
                    l.getStatus(),
                    l.getCreatedDate(),
                    missingDocuments,
                    l.getAdminRemark()
            );

            result.add(dto);
        }

        return result;   // ✅ FIX (VERY IMPORTANT)
    }


    @Override
    public LoanDashboardDTO getPendingByCase(String caseNumber) {

        LoanApplication loan =
                loanRepo.findByCaseNumberAndStatus(caseNumber, LoanStatus.PENDING);

        if (loan == null) {
            throw new RuntimeException("Pending loan not found");
        }

        return mapToDTO(loan);
    }

    @Override
    @Transactional
    public String approveLoan(String caseNumber) {

        LoanApplication loan = loanRepo.findByCaseNumber(caseNumber);

        if (loan == null) {
            throw new RuntimeException("Loan not found");
        }

        if (loan.getStatus() != LoanStatus.SUBMITTED_TO_BANK
                && loan.getStatus() != LoanStatus.ASSIGNED_TO_BANK) {
            throw new RuntimeException("Loan not in bank stage");
        }

        loan.setStatus(LoanStatus.APPROVED);
        loan.setUpdatedDate(LocalDate.now());

        loanRepo.save(loan);

// SEND MAIL
        String subject = "Loan Approved";
        String body = "Dear Customer,\n\n"
                + "Your loan has been APPROVED successfully.\n"
                + "Case Number: " + caseNumber + "\n\n"
                + "Thank you.";

        emailService.sendEmail(loan.getUser().getEmail(), subject, body);

        return "Loan " + caseNumber + " APPROVED successfully";
    }

    @Override
    @Transactional
    public String rejectLoan(String caseNumber) {

        LoanApplication loan = loanRepo.findByCaseNumber(caseNumber);

        if (loan == null) {
            throw new RuntimeException("Loan not found");
        }

        if (loan.getStatus() != LoanStatus.SUBMITTED_TO_BANK
                && loan.getStatus() != LoanStatus.ASSIGNED_TO_BANK) {
            throw new RuntimeException("Loan not in bank stage");
        }

        loan.setStatus(LoanStatus.REJECTED);
        loan.setUpdatedDate(LocalDate.now());

        loanRepo.save(loan);


// SEND MAIL
        String subject = "Loan Rejected";
        String body = "Dear Customer,\n\n"
                + "We regret to inform you that your loan has been REJECTED.\n"
                + "Case Number: " + caseNumber + "\n\n"
                + "Please contact support for more details.";

        emailService.sendEmail(loan.getUser().getEmail(), subject, body);

        return "Loan " + caseNumber + " REJECTED successfully";
    }

    @Override
    public LoanDashboardDTO getUnderReviewByCase(String caseNumber) {

        LoanApplication loan =
                loanRepo.findByCaseNumberAndStatus(caseNumber, LoanStatus.UNDER_REVIEW);

        if (loan == null) {
            throw new RuntimeException("Under Review loan not found");
        }

        return mapToDTO(loan);
    }

    @Override
    public PendingDocumentDTO getDocumentsPendingByCase(String caseNumber) {

        Optional<LoanApplication> optionalLoan = Optional.ofNullable(loanRepo.findByCaseNumber(caseNumber));

        if (!optionalLoan.isPresent()) {
            throw new RuntimeException("Loan not found");
        }

        LoanApplication loan = optionalLoan.get();

        List<Document> documents = loan.getDocuments();

        Set<DocumentType> uploadedDocs = new HashSet<>();

        if (documents != null) {
            for (Document doc : documents) {

                if (doc.getStatus() == DocumentStatus.APPROVED ||
                        doc.getStatus() == DocumentStatus.VERIFIED) {

                    uploadedDocs.add(doc.getDocumentType());
                }
            }
        }

        List<String> pendingDocs = new ArrayList<>();

        for (DocumentType type : DocumentType.values()) {

            if (!uploadedDocs.contains(type)) {
                pendingDocs.add(type.name().replace("_", " "));
            }
        }

        return new PendingDocumentDTO(pendingDocs);
    }


    @Override
    public LoanDashboardDTO getApprovedByCase(String caseNumber) {

        LoanApplication loan =
                loanRepo.findByCaseNumberAndStatus(caseNumber, LoanStatus.APPROVED);

        if (loan == null) {
            throw new RuntimeException("Approved loan not found");
        }

        return mapToDTO(loan);
    }

    @Override
    public LoanDashboardDTO getDisbursedByCase(String caseNumber) {

        LoanApplication loan =
                loanRepo.findByCaseNumberAndStatus(caseNumber, LoanStatus.DISBURSED);

        if (loan == null) {
            throw new RuntimeException("Disbursed loan not found");
        }

        return mapToDTO(loan);
    }

    @Override
    @Transactional
    public String submitToBank(String caseNumber) {

        LoanApplication loan = loanRepo.findByCaseNumber(caseNumber);

        if (loan == null) {
            throw new RuntimeException("Loan not found");
        }

        if (loan.getStatus() != LoanStatus.PENDING) {
            throw new RuntimeException("Only PENDING loans can be submitted");
        }

        loan.setStatus(LoanStatus.SUBMITTED_TO_BANK);
        loan.setUpdatedDate(LocalDate.now());

        loanRepo.save(loan);

        return "Loan submitted to bank successfully";
    }

    @Override
    @Transactional
    public String rejectAndSoftDelete(String caseNumber) {

        LoanApplication loan = loanRepo.findByCaseNumber(caseNumber);

        if (loan == null) {
            throw new RuntimeException("Loan not found");
        }

        if (loan.getStatus() != LoanStatus.REJECTED
                && loan.getStatus() != LoanStatus.REJECTED_BY_ADMIN) {
            throw new RuntimeException("Only rejected loans can be deleted");
        }

        loan.setIsDeleted(true);
        loan.setUpdatedDate(LocalDate.now());

        loanRepo.save(loan);

        return "Loan soft deleted successfully";
    }


    /*--------------------------inbuild method---------------------------------------------------------------*/
    private LoanDashboardDTO mapToDTO(LoanApplication l) {

        String fullName = "";
        if (l.getUser() != null && l.getUser().getPersonalDetails() != null) {
            fullName = l.getUser().getPersonalDetails().getFullName();
        }

        String mobile = "";
        if (l.getUser() != null) {
            mobile = l.getUser().getMobileNumber();
        }

        String vehicle = "";
        if (l.getVehicle() != null) {
            vehicle = l.getVehicle().getCarMake() + " " + l.getVehicle().getModel();
        }

        String bank = "";
        if (l.getBank() != null) {
            bank = l.getBank().getBankName();
        }

        // ✅ Get uploaded documents (SAFE VERSION)
        List<Document> uploadedDocs = documentRepository.findByLoanApplicationId(l.getId());

        // ✅ Store uploaded types
        Set<DocumentType> uploadedTypes = new HashSet<>();
        for (Document doc : uploadedDocs) {
            uploadedTypes.add(doc.getDocumentType());
        }

        // ✅ Get all document types
        DocumentType[] allDocs = DocumentType.values();

        // ✅ Find missing documents
        List<String> missingDocs = new ArrayList<>();
        for (DocumentType docType : allDocs) {
            if (!uploadedTypes.contains(docType)) {
                missingDocs.add(docType.name());
            }
        }

        // ✅ Return DTO
        return new LoanDashboardDTO(
                l.getCaseNumber(),
                fullName,
                mobile,
                vehicle,
                l.getLoanAmount(),
                bank,
                l.getStatus(),
                l.getCreatedDate(),
                missingDocs,
                l.getAdminRemark()
        );
    }

    @Override
    @Transactional
    public String assignBankByAdmin(String caseNumber, Long bankId) {

        LoanApplication loan = loanRepo.findByCaseNumber(caseNumber);

        if (loan == null) {
            throw new RuntimeException("Loan not found");
        }

        if (!ADMIN_PRE_BANK_STATUSES.contains(loan.getStatus())) {
            throw new RuntimeException("Only pending / under-review cases can be assigned to a bank");
        }

        Bank bank = bankRepo.findById(bankId)
                .orElseThrow(() -> new RuntimeException("Bank not found"));

        loan.setBank(bank);
        loan.setStatus(LoanStatus.ASSIGNED_TO_BANK);
        loan.setAdminRemark(null);
        loan.setUpdatedDate(LocalDate.now());
        loanRepo.save(loan);

        return "Case " + caseNumber + " assigned to " + bank.getBankName()
                + " (ASSIGNED_TO_BANK)";
    }

    @Override
    @Transactional
    public String rejectByAdmin(String caseNumber, String remark) {

        LoanApplication loan = loanRepo.findByCaseNumber(caseNumber);

        if (loan == null) {
            throw new RuntimeException("Loan not found");
        }

        if (!ADMIN_PRE_BANK_STATUSES.contains(loan.getStatus())) {
            throw new RuntimeException("Only pending / under-review cases can be rejected by admin");
        }

        String clean = remark == null ? "" : remark.trim();
        if (clean.isEmpty()) {
            throw new RuntimeException("Remark is required");
        }

        loan.setStatus(LoanStatus.REJECTED_BY_ADMIN);
        loan.setAdminRemark(clean);
        loan.setUpdatedDate(LocalDate.now());
        loanRepo.save(loan);

        if (loan.getUser() != null && loan.getUser().getEmail() != null) {
            String subject = "Loan application update";
            String body = "Dear Customer,\n\n"
                    + "Your loan application could not proceed at this time.\n"
                    + "Case Number: " + caseNumber + "\n"
                    + "Remark: " + clean + "\n\n"
                    + "Thank you.";
            emailService.sendEmail(loan.getUser().getEmail(), subject, body);
        }

        return "Case " + caseNumber + " marked REJECTED_BY_ADMIN";
    }
}
