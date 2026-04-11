package com.finserv.serviceImpl;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.finserv.dto.LoanDashboardDTO;
import com.finserv.dto.LoanRequestDTO;
import com.finserv.dto.LoanResponseDTO;
import com.finserv.emailservice.EmailService;
import com.finserv.entity.Bank;
import com.finserv.entity.LoanApplication;
import com.finserv.entity.User;
import com.finserv.enums.LoanStatus;
import com.finserv.enums.LoanType;
import com.finserv.repository.BankRepository;
import com.finserv.repository.LoanApplicationRepository;
import com.finserv.repository.UserRepository;
import com.finserv.service.LoanService;
@Service
public class LoanServiceImpl implements LoanService {

    @Autowired
    private LoanApplicationRepository loanRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private BankRepository bankRepo;

    @Autowired
    private EmailService emailService;

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
        response.setId(saved.getId());
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

            LoanDashboardDTO dto = new LoanDashboardDTO(
                    l.getCaseNumber(),
                    fullName,
                    mobile,
                    vehicle,
                    l.getLoanAmount(),
                    bankName,
                    l.getStatus(),
                    l.getCreatedDate()
            );

            result.add(dto);
        }

        return result;
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

        // ✅ Check valid stage
        // if (loan.getStatus() != LoanStatus.SUBMITTED_TO_BANK) {
        //     throw new RuntimeException("Loan not in bank stage");
        // }

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

        // ✅ Check valid stage
        // if (loan.getStatus() != LoanStatus.SUBMITTED_TO_BANK) {
        //     throw new RuntimeException("Loan not in bank stage");
        // }

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
    public LoanDashboardDTO getDocumentsPendingByCase(String caseNumber) {

        LoanApplication loan =
                loanRepo.findByCaseNumberAndStatus(caseNumber, LoanStatus.DOCUMENTS_PENDING);

        if (loan == null) {
            throw new RuntimeException("Documents Pending loan not found");
        }

        return mapToDTO(loan);
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

        // if (loan.getStatus() != LoanStatus.PENDING) {
        //     throw new RuntimeException("Only PENDING loans can be submitted");
        // }

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

        if (loan.getStatus() != LoanStatus.REJECTED) {
            throw new RuntimeException("Only REJECTED loans can be deleted");
        }

        loan.setIsDeleted(true);
        loan.setUpdatedDate(LocalDate.now());

        loanRepo.save(loan);

        return "Loan soft deleted successfully";
    }


/*--------------------------inbuild method---------------------------------------------------------------*/
    private LoanDashboardDTO mapToDTO(LoanApplication l) {

        String fullName = l.getUser().getPersonalDetails().getFullName();
        String mobile = l.getUser().getMobileNumber();
        String vehicle = l.getVehicle().getCarMake() + " " + l.getVehicle().getModel();
        String bank = l.getBank() != null ? l.getBank().getBankName() : "";

        return new LoanDashboardDTO(
                l.getCaseNumber(),
                fullName,
                mobile,
                vehicle,
                l.getLoanAmount(),
                bank,
                l.getStatus(),
                l.getCreatedDate()
        );
    }
}