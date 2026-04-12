package com.finserv.service;

import com.finserv.dto.LoanDashboardDTO;
import com.finserv.dto.LoanRequestDTO;
import com.finserv.dto.LoanResponseDTO;
import com.finserv.dto.PendingDocumentDTO;

import java.util.List;

public interface LoanService {

    LoanResponseDTO createLoan(LoanRequestDTO dto);

    //List<LoanResponseDTO> searchLoans(LoanSearchRequestDTO request);

    List<LoanDashboardDTO> getAllLoans();


    List<LoanDashboardDTO> searchLoans(String caseNumber, String name);

    //List<LoanDashboardDTO> getLoansByStatus(String status);

    //String updateLoanStatus(String caseNumber, String status);
    LoanDashboardDTO getPendingByCase(String caseNumber);

    LoanDashboardDTO getUnderReviewByCase(String caseNumber);

    PendingDocumentDTO getDocumentsPendingByCase(String caseNumber);

    LoanDashboardDTO getApprovedByCase(String caseNumber);

    LoanDashboardDTO getDisbursedByCase(String caseNumber);

    // Soft delete
    String rejectAndSoftDelete(String caseNumber);

    String submitToBank(String caseNumber);

    String approveLoan(String caseNumber);

    String rejectLoan(String caseNumber);


}
