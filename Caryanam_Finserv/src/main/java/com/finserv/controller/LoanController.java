package com.finserv.controller;

import com.finserv.dto.*;
import com.finserv.exception.BadRequestException;
import com.finserv.service.LoanService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loans")
public class LoanController {

    @Autowired
    private LoanService loanService;

    // ✅ CREATE LOAN
    @PostMapping("/create")
    public ResponseEntity<LoanResponseDTO> createLoan(@Valid @RequestBody LoanRequestDTO dto) {

        if (dto == null) {
            throw new BadRequestException("Request body is missing");
        }

        // 1️⃣ Loan Type
        if (dto.getLoanType() == null || dto.getLoanType().isBlank()) {
            throw new BadRequestException("Loan type is required");
        }

        if (!dto.getLoanType().matches("^[A-Z_]+$")) {
            throw new BadRequestException("Invalid loan type format");
        }

        // 2️⃣ Loan Amount
        if (dto.getLoanAmount() == null) {
            throw new BadRequestException("Loan amount is required");
        }

        if (dto.getLoanAmount() <= 0) {
            throw new BadRequestException("Loan amount must be greater than 0");
        }

        if (dto.getLoanAmount() > 10_00_00_000) {
            throw new BadRequestException("Loan amount too large");
        }

        // 3️⃣ Down Payment
        if (dto.getDownPayment() == null) {
            throw new BadRequestException("Down payment is required");
        }

        if (dto.getDownPayment() < 0) {
            throw new BadRequestException("Down payment cannot be negative");
        }

        if (dto.getDownPayment() > dto.getLoanAmount()) {
            throw new BadRequestException("Down payment cannot be greater than loan amount");
        }

        if (dto.getDownPayment() == 0) {
            throw new BadRequestException("Down payment should not be zero");
        }

        // 4️⃣ Tenure
        if (dto.getTenure() == null) {
            throw new BadRequestException("Tenure is required");
        }

        if (dto.getTenure() < 6 || dto.getTenure() > 360) {
            throw new BadRequestException("Tenure must be between 6 and 360 months");
        }

        if (dto.getTenure() % 6 != 0) {
            throw new BadRequestException("Tenure should be in multiples of 6");
        }

        // 5️⃣ User ID
        if (dto.getUserId() == null || dto.getUserId() <= 0) {
            throw new BadRequestException("Valid user ID is required");
        }

        return ResponseEntity.status(201)
                .body(loanService.createLoan(dto));
    }

    // ✅ DASHBOARD
    @GetMapping("/dashboard")
    public ResponseEntity<List<LoanDashboardDTO>> getAllLoans() {
        return ResponseEntity.ok(loanService.getAllLoans());
    }

    // ✅ SEARCH
    @PostMapping("/search")
    public ResponseEntity<List<LoanDashboardDTO>> search(
            @Valid @RequestBody LoanSearchRequest request) {

        if ((request.getCaseNumber() == null || request.getCaseNumber().isBlank()) &&
                (request.getName() == null || request.getName().isBlank())) {
            throw new BadRequestException("At least caseNumber or name must be provided");
        }

        return ResponseEntity.ok(
                loanService.searchLoans(request.getCaseNumber(), request.getName())
        );
    }

    // ✅ APPROVE
    @PutMapping("/approve")
    public ResponseEntity<String> approve(@Valid @RequestBody CaseRequestDTO request) {

        if (request.getCaseNumber() == null || request.getCaseNumber().isBlank()) {
            throw new BadRequestException("Case number is required");
        }

        return ResponseEntity.ok(
                loanService.approveLoan(request.getCaseNumber())
        );
    }

    // ✅ REJECT
    @PutMapping("/reject")
    public ResponseEntity<String> reject(@Valid @RequestBody CaseRequestDTO request) {

        if (request.getCaseNumber() == null || request.getCaseNumber().isBlank()) {
            throw new BadRequestException("Case number is required");
        }

        return ResponseEntity.ok(
                loanService.rejectLoan(request.getCaseNumber())
        );
    }

    // ✅ PENDING
    @PostMapping("/pending")
    public ResponseEntity<LoanDashboardDTO> getPending(@Valid @RequestBody CaseRequestDTO request) {

        if (request.getCaseNumber() == null || request.getCaseNumber().isBlank()) {
            throw new BadRequestException("Case number is required");
        }

        return ResponseEntity.ok(
                loanService.getPendingByCase(request.getCaseNumber())
        );
    }

    // ✅ UNDER REVIEW
    @PostMapping("/underReview")
    public ResponseEntity<LoanDashboardDTO> getUnderReview(@Valid @RequestBody CaseRequestDTO request) {

        if (request.getCaseNumber() == null || request.getCaseNumber().isBlank()) {
            throw new BadRequestException("Case number is required");
        }

        return ResponseEntity.ok(
                loanService.getUnderReviewByCase(request.getCaseNumber())
        );
    }

    // ✅ DISBURSED
    @PostMapping("/disbursed")
    public ResponseEntity<LoanDashboardDTO> getDisbursed(@Valid @RequestBody CaseRequestDTO request) {

        if (request.getCaseNumber() == null || request.getCaseNumber().isBlank()) {
            throw new BadRequestException("Case number is required");
        }

        return ResponseEntity.ok(
                loanService.getDisbursedByCase(request.getCaseNumber())
        );
    }

    // ✅ SUBMIT TO BANK
    @PutMapping("/submit-to-bank")
    public ResponseEntity<String> submitToBank(@Valid @RequestBody CaseRequestDTO request) {

        if (request.getCaseNumber() == null || request.getCaseNumber().isBlank()) {
            throw new BadRequestException("Case number is required");
        }

        return ResponseEntity.ok(
                loanService.submitToBank(request.getCaseNumber())
        );
    }
}