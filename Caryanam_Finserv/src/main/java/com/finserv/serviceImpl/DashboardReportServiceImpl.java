package com.finserv.serviceImpl;

import com.finserv.dto.reportDTO.DashboardResponseDTO;
import com.finserv.repository.LoanApplicationRepository;
import com.finserv.service.DashboardReportService;

import com.lowagie.text.Document;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;
import com.lowagie.text.pdf.PdfPTable;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;


import java.io.ByteArrayOutputStream;

@Service
public class DashboardReportServiceImpl implements DashboardReportService {

    private final LoanApplicationRepository repo;

    public DashboardReportServiceImpl(LoanApplicationRepository repo) {
        this.repo = repo;
    }

    @Override
    public DashboardResponseDTO getDashboard(int year) {

        DashboardResponseDTO res = new DashboardResponseDTO();

        // 1️⃣ Approval vs Rejection
        res.setApprovalVsRejection(repo.getApprovalVsRejection(year));

        // 2️⃣ Monthly Disbursement
        res.setDisbursement(repo.getMonthlyDisbursement(year));

        // 3️⃣ Bank Distribution
        res.setBankDistribution(repo.getBankDistribution());

        // 4️⃣ Turnaround Time
        res.setTurnaroundTime(repo.getTurnaroundTime());

        return res;
    }

    // ================== EXCEL ==================
    @Override
    public byte[] exportExcel(int year) {

        try (Workbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            DashboardResponseDTO data = getDashboard(year);

            Sheet sheet = workbook.createSheet("Dashboard");

            int rowIdx = 0;

            // ================= TITLE =================
            Row title = sheet.createRow(rowIdx++);
            title.createCell(0).setCellValue("Dashboard Report - " + year);

            // ================= APPROVAL vs REJECTION =================
            rowIdx++; // empty row

            Row header1 = sheet.createRow(rowIdx++);
            header1.createCell(0).setCellValue("Month");
            header1.createCell(1).setCellValue("Approved");
            header1.createCell(2).setCellValue("Rejected");

            for (var d : data.getApprovalVsRejection()) {
                Row r = sheet.createRow(rowIdx++);
                r.createCell(0).setCellValue(d.getMonth());
                r.createCell(1).setCellValue(d.getApproved());
                r.createCell(2).setCellValue(d.getRejected());
            }

            // ================= DISBURSEMENT =================
            rowIdx++; // empty row

            Row header2 = sheet.createRow(rowIdx++);
            header2.createCell(0).setCellValue("Month");
            header2.createCell(1).setCellValue("Disbursement");

            for (var d : data.getDisbursement()) {
                Row r = sheet.createRow(rowIdx++);
                r.createCell(0).setCellValue(d.getMonth());
                r.createCell(1).setCellValue(d.getTotalAmount());
            }

            // ================= AUTO SIZE =================
            for (int i = 0; i < 3; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return out.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Excel generation failed", e);
        }
    }

    // ================== PDF ==================
    @Override
    public byte[] exportPdf(int year) {

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            Document document = new Document();
            PdfWriter.getInstance(document, out);

            document.open();

            DashboardResponseDTO data = getDashboard(year);

            // ================= TITLE =================
            document.add(new Paragraph("Dashboard Report - " + year));
            document.add(new Paragraph(" "));

            // ================= APPROVAL vs REJECTION =================
            document.add(new Paragraph("Approval vs Rejection"));

            PdfPTable table1 = new PdfPTable(3);
            table1.addCell("Month");
            table1.addCell("Approved");
            table1.addCell("Rejected");

            data.getApprovalVsRejection().forEach(d -> {
                table1.addCell(d.getMonth());
                table1.addCell(String.valueOf(d.getApproved()));
                table1.addCell(String.valueOf(d.getRejected()));
            });

            document.add(table1);
            document.add(new Paragraph(" "));

            // ================= DISBURSEMENT =================
            document.add(new Paragraph("Monthly Disbursement"));

            PdfPTable table2 = new PdfPTable(2);
            table2.addCell("Month");
            table2.addCell("Amount");

            data.getDisbursement().forEach(d -> {
                table2.addCell(d.getMonth());
                table2.addCell(String.valueOf(d.getTotalAmount()));
            });

            document.add(table2);

            document.close();

            return out.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("PDF generation failed", e);
        }
    }
}