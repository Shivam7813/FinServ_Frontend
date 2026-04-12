package com.finserv.controller;

import com.finserv.dto.reportDTO.DashboardRequestDTO;
import com.finserv.dto.reportDTO.DashboardResponseDTO;
import com.finserv.exception.BadRequestException;
import com.finserv.service.DashboardReportService;

import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin("*")
public class DashboardReportController {

    private final DashboardReportService service;

    public DashboardReportController(DashboardReportService service) {
        this.service = service;
    }

    // ✅ Common Validation Method
    private void validateRequest(DashboardRequestDTO request) {
        if (request == null) {
            throw new BadRequestException("Request body cannot be null");
        }

        if (request.getYear() == null) {
            throw new BadRequestException("Year is required");
        }

        if (request.getYear() < 2000 || request.getYear() > 2100) {
            throw new BadRequestException("Year must be between 2000 and 2100");
        }
    }

    // ✅ Get Dashboard Data
    @PostMapping("/data")
    public ResponseEntity<DashboardResponseDTO> getDashboard(
            @Valid @RequestBody DashboardRequestDTO request
    ) {
        validateRequest(request);

        DashboardResponseDTO response = service.getDashboard(request.getYear());

        return ResponseEntity.ok(response);
    }

    // ✅ Export Excel
    @PostMapping("/excel")
    public ResponseEntity<byte[]> exportExcel(
            @Valid @RequestBody DashboardRequestDTO request
    ) {
        validateRequest(request);

        byte[] file = service.exportExcel(request.getYear());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=dashboard.xlsx")
                .header("message", "Excel report generated successfully")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(file);
    }

    // ✅ Export PDF
    @PostMapping("/pdf")
    public ResponseEntity<byte[]> exportPdf(
            @Valid @RequestBody DashboardRequestDTO request
    ) {
        validateRequest(request);

        byte[] file = service.exportPdf(request.getYear());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=dashboard.pdf")
                .header("message", "PDF report generated successfully")
                .contentType(MediaType.APPLICATION_PDF)
                .body(file);
    }
}