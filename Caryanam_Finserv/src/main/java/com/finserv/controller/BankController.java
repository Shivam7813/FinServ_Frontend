package com.finserv.controller;

import com.finserv.dto.*;
import com.finserv.exception.BadRequestException;
import com.finserv.service.BankService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/banks")
public class BankController {

    @Autowired
    private BankService bankService;

    // ✅ ADD BANK (ALL VALIDATION HERE)
    @PostMapping("/add")
    public ResponseEntity<BankResponseDTO> addBank(@RequestBody BankRequestDTO request) {

        // 1️⃣ Bank Name
        if (request.getBankName() == null || request.getBankName().isBlank())
            throw new BadRequestException("Bank name is required");

        if (request.getBankName().length() < 2 || request.getBankName().length() > 50)
            throw new BadRequestException("Bank name must be 2-50 characters");

        // 🔥 EXTRA (missing)
        if (!request.getBankName().matches("^[A-Za-z ]+$"))
            throw new BadRequestException("Bank name must contain only alphabets");

        // 2️⃣ ROI
        if (request.getRoiMin() == null)
            throw new BadRequestException("Minimum ROI is required");

        if (request.getRoiMax() == null)
            throw new BadRequestException("Maximum ROI is required");

        if (request.getRoiMin() <= 0 || request.getRoiMax() <= 0)
            throw new BadRequestException("ROI must be greater than 0");

        if (request.getRoiMin() > request.getRoiMax())
            throw new BadRequestException("ROI min cannot be greater than ROI max");

        // 🔥 EXTRA (real-world check)
        if (request.getRoiMax() > 50)
            throw new BadRequestException("ROI seems unrealistic");

        // 3️⃣ Processing Days
        if (request.getProcessingDays() == null || request.getProcessingDays().isBlank())
            throw new BadRequestException("Processing days required");

        if (!request.getProcessingDays().matches("^[0-9]+(-[0-9]+)?\\sDays$"))
            throw new BadRequestException("Format must be '3 Days' or '3-5 Days'");

        // 4️⃣ LTV
        if (request.getMaxLtv() == null)
            throw new BadRequestException("Max LTV required");

        if (request.getMaxLtv() < 0 || request.getMaxLtv() > 100)
            throw new BadRequestException("LTV must be between 0-100");

        // 🔥 EXTRA
        if (request.getMaxLtv() < 50)
            throw new BadRequestException("LTV too low (must be realistic)");

        // 5️⃣ Tenure
        if (request.getMaxTenureMonths() == null)
            throw new BadRequestException("Max tenure required");

        if (request.getMaxTenureMonths() < 1 || request.getMaxTenureMonths() > 360)
            throw new BadRequestException("Tenure must be 1-360");

        // 🔥 EXTRA
        if (request.getMaxTenureMonths() < 6)
            throw new BadRequestException("Tenure too short");

        // 6️⃣ Features
        if (request.getFeatures() != null) {

            if (request.getFeatures().isEmpty()) {
                throw new BadRequestException("Features list cannot be empty");
            }

            for (String f : request.getFeatures()) {
                if (f == null || f.isBlank()) {
                    throw new BadRequestException("Feature cannot be blank");
                }

                // 🔥 EXTRA
                if (f.length() < 2) {
                    throw new BadRequestException("Feature too short");
                }
            }
        }

        return ResponseEntity.status(201).body(bankService.addBank(request));
    }

    // ✅ GET ALL
    @GetMapping("/getAll")
    public ResponseEntity<List<BankResponseDTO>> getAllBanks() {
        return ResponseEntity.ok(bankService.getAllBanks());
    }

    // ✅ UPDATE ROI
    @PutMapping("/roi")
    public ResponseEntity<BankResponseDTO> updateRoi(
            @RequestBody UpdateRoiDTO dto) {

        // 1️⃣ ID validation
        if (dto.getBankid() == null || dto.getBankid() <= 0)
            throw new BadRequestException("Invalid ID");

        // 2️⃣ ROI validation
        if (dto.getRoiMin() == null || dto.getRoiMax() == null)
            throw new BadRequestException("ROI values required");

        if (dto.getRoiMin() <= 0 || dto.getRoiMax() <= 0)
            throw new BadRequestException("ROI must be greater than 0");

        if (dto.getRoiMin() > dto.getRoiMax())
            throw new BadRequestException("Invalid ROI range");

        return ResponseEntity.ok(bankService.updateRoi(dto.getBankid(), dto));
    }
    // ✅ DASHBOARD
    @GetMapping("/dashboard")
    public ResponseEntity<List<BankDashboardDTO>> getDashboard() {
        return ResponseEntity.ok(bankService.getDashboard());
    }
}