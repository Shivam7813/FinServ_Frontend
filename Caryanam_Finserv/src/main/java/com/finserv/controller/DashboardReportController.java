package com.finserv.controller;


import com.finserv.dto.reportDTO.DashboardRequestDTO;
import com.finserv.dto.reportDTO.DashboardResponseDTO;
import com.finserv.service.DashboardReportService;
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

    // ✅ Get Dashboard Data
    @PostMapping("/data")
    public ResponseEntity<DashboardResponseDTO> getDashboard(
            @RequestBody DashboardRequestDTO request
    ) {
        return ResponseEntity.ok(service.getDashboard(request.getYear()));
    }

    /// ✅ Export Excel (JSON input)
    @PostMapping("/excel")
    public ResponseEntity<byte[]> exportExcel(@RequestBody DashboardRequestDTO request) {

        byte[] file = service.exportExcel(request.getYear());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=dashboard.xlsx")
                .header("message", "Excel report generated successfully")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(file);
    }

    // ✅ Export PDF (JSON input)
    @PostMapping("/pdf")
    public ResponseEntity<byte[]> exportPdf(@RequestBody DashboardRequestDTO request) {

        byte[] file = service.exportPdf(request.getYear());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=dashboard.pdf")
                .header("message", "PDF report generated successfully")
                .contentType(MediaType.APPLICATION_PDF)
                .body(file);
    }
}