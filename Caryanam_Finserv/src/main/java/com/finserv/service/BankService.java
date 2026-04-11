package com.finserv.service;

import com.finserv.dto.BankDashboardDTO;
import com.finserv.dto.BankRequestDTO;
import com.finserv.dto.BankResponseDTO;
import com.finserv.dto.UpdateRoiDTO;

import java.util.List;

public interface BankService {

    BankResponseDTO addBank(BankRequestDTO request);

    List<BankResponseDTO> getAllBanks();

    BankResponseDTO updateRoi(Long bankId, UpdateRoiDTO dto);

    List<BankDashboardDTO> getDashboard();
}