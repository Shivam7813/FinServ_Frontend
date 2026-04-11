package com.finserv.service;

import com.finserv.dto.reportDTO.DashboardResponseDTO;



public interface DashboardReportService {

    DashboardResponseDTO getDashboard(int year);

    byte[] exportExcel(int year);
    // ================== PDF ==================
    byte[] exportPdf(int year);



}
