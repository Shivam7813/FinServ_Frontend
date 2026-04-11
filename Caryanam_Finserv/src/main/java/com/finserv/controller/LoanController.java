package com.finserv.controller;

import com.finserv.dto.*;
import com.finserv.exception.BadRequestException;
import com.finserv.service.LoanService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

    @RestController
    @RequestMapping("/api/loans")
    public class LoanController {

        @Autowired
        private LoanService loanService;

        //  CREATE LOAN (ALL VALIDATION HERE)
        @PostMapping("/create")
        public ResponseEntity<LoanResponseDTO> createLoan(@RequestBody LoanRequestDTO dto) {

            // 0️⃣ DTO NULL CHECK (🔥 IMPORTANT)
            if (dto == null) {
                throw new BadRequestException("Request body is missing");
            }

            // 1️⃣ Loan Type
            if (dto.getLoanType() == null || dto.getLoanType().isBlank()) {
                throw new BadRequestException("Loan type is required");
            }

            // 🔥 FORMAT VALIDATION (ENUM SAFE)
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

            // 🔥 EXTRA (upper limit safety)
            if (dto.getLoanAmount() > 10_00_00_000) { // 10 Cr limit example
                throw new BadRequestException("Loan amount too large");
            }

            // 3️⃣ Down Payment
            if (dto.getDownPayment() == null) {
                throw new BadRequestException("Down payment is required");
            }

            if (dto.getDownPayment() < 0) {
                throw new BadRequestException("Down payment cannot be negative");
            }

            // 🔥 BUSINESS RULE
            if (dto.getDownPayment() > dto.getLoanAmount()) {
                throw new BadRequestException("Down payment cannot be greater than loan amount");
            }

            // 🔥 EXTRA (minimum down payment rule optional)
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

            // 🔥 EXTRA (logical grouping)
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

        //  DASHBOARD
        @GetMapping("/dashboard")
        public ResponseEntity<List<LoanDashboardDTO>> getAllLoans() {
            return ResponseEntity.ok(loanService.getAllLoans());
        }

        //SEARCH BY NAME AND CASE_NO
        @PostMapping("/search")
        public ResponseEntity<List<LoanDashboardDTO>> search(
                @RequestBody LoanSearchRequest request) {

            return ResponseEntity.ok(
                    loanService.searchLoans(request.getCaseNumber(), request.getName())
            );
        }

        @PutMapping("/approve")
        public ResponseEntity<String> approve(@RequestBody CaseRequestDTO request) {

            if (request.getCaseNumber() == null || request.getCaseNumber().isBlank()) {
                throw new RuntimeException("Case number is required");
            }

            return ResponseEntity.ok(
                    loanService.approveLoan(request.getCaseNumber())
            );
        }

        @PutMapping("/reject")
        public ResponseEntity<String> reject(@RequestBody CaseRequestDTO request) {

            if (request.getCaseNumber() == null || request.getCaseNumber().isBlank()) {
                throw new RuntimeException("Case number is required");
            }

            return ResponseEntity.ok(
                    loanService.rejectLoan(request.getCaseNumber())
            );
        }

        @PostMapping("/pending")
        public ResponseEntity<LoanDashboardDTO> getPending(@RequestBody CaseRequestDTO request) {

            if (request.getCaseNumber() == null || request.getCaseNumber().isBlank()) {
                throw new RuntimeException("Case number is required");
            }

            return ResponseEntity.ok(
                    loanService.getPendingByCase(request.getCaseNumber())
            );
        }

        @PostMapping("/under-review")
        public ResponseEntity<LoanDashboardDTO> getUnderReview(@RequestBody CaseRequestDTO request) {

            if (request.getCaseNumber() == null || request.getCaseNumber().isBlank()) {
                throw new RuntimeException("Case number is required");
            }

            return ResponseEntity.ok(
                    loanService.getUnderReviewByCase(request.getCaseNumber())
            );
        }

        @GetMapping("/documents-pending/{caseNumber}")
        public ResponseEntity<LoanDashboardDTO> getDocsPending(@PathVariable String caseNumber) {
            return ResponseEntity.ok(loanService.getDocumentsPendingByCase(caseNumber));
        }

        @PostMapping("/documents-pending")
        public ResponseEntity<LoanDashboardDTO> getDocsPending(@RequestBody CaseRequestDTO request) {

            if (request.getCaseNumber() == null || request.getCaseNumber().isBlank()) {
                throw new RuntimeException("Case number is required");
            }

            return ResponseEntity.ok(
                    loanService.getDocumentsPendingByCase(request.getCaseNumber())
            );
        }

        @PostMapping("/disbursed")
        public ResponseEntity<LoanDashboardDTO> getDisbursed(@RequestBody CaseRequestDTO request) {

            if (request.getCaseNumber() == null || request.getCaseNumber().isBlank()) {
                throw new RuntimeException("Case number is required");
            }

            return ResponseEntity.ok(
                    loanService.getDisbursedByCase(request.getCaseNumber())
            );
        }



        @PutMapping("/submit-to-bank")
        public ResponseEntity<String> submitToBank(@RequestBody CaseRequestDTO request) {

            return ResponseEntity.ok(
                    loanService.submitToBank(request.getCaseNumber())
            );
        }


    }