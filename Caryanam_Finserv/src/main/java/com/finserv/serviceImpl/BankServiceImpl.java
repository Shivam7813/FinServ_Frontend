package com.finserv.serviceImpl;

import com.finserv.dto.BankDashboardDTO;
import com.finserv.dto.BankRequestDTO;
import com.finserv.dto.BankResponseDTO;
import com.finserv.dto.UpdateRoiDTO;
import com.finserv.entity.Bank;
import com.finserv.exception.BadRequestException;
import com.finserv.exception.ResourceNotFoundException;
import com.finserv.repository.BankRepository;
import com.finserv.service.BankService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class BankServiceImpl implements BankService {

    @Autowired
    private BankRepository bankRepository;

    // ✅ ADD BANK
    @Override
    public BankResponseDTO addBank(BankRequestDTO request) {

        // 🔥 Only business validation (duplicate)
        bankRepository.findByBankName(request.getBankName())
                .ifPresent(b -> {
                    throw new BadRequestException("Bank already exists");
                });

        // 👉 DTO → ENTITY
        Bank bank = new Bank();
        bank.setBankName(request.getBankName());
        bank.setRoiMin(request.getRoiMin());
        bank.setRoiMax(request.getRoiMax());
        bank.setProcessingDays(request.getProcessingDays());
        bank.setMaxLtv(request.getMaxLtv());
        bank.setMaxTenureMonths(request.getMaxTenureMonths());
        bank.setFeatures(request.getFeatures());
        bank.setCasesThisMonth(0);
        bank.setStatus("ACTIVE");

        Bank savedBank = bankRepository.save(bank);

        return mapToDTO(savedBank);
    }

    // ✅ GET ALL BANKS
    @Override
    public List<BankResponseDTO> getAllBanks() {

        return bankRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    // ✅ UPDATE ROI
    @Override
    public BankResponseDTO updateRoi(Long id, UpdateRoiDTO dto) {

        Bank bank = bankRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Bank not found with id: " + id));

        // update ROI
        bank.setRoiMin(dto.getRoiMin());
        bank.setRoiMax(dto.getRoiMax());

        Bank updated = bankRepository.save(bank);

        return mapToDTO(updated);
    }

    // ✅ DASHBOARD
    @Override
    public List<BankDashboardDTO> getDashboard() {

        // Custom query
        List<BankDashboardDTO> dashboardList = bankRepository.getBankDashboard();

        // Fetch all banks for features mapping
        List<Bank> banks = bankRepository.findAll();

        Map<Long, List<String>> featureMap = banks.stream()
                .collect(Collectors.toMap(
                        Bank::getId,
                        Bank::getFeatures
                ));

        // Set features into dashboard DTO
        dashboardList.forEach(dto -> {
            dto.setFeatures(featureMap.get(dto.getBankId()));
        });

        return dashboardList;
    }

    // 🔥 COMMON MAPPER METHOD
    private BankResponseDTO mapToDTO(Bank bank) {

        BankResponseDTO dto = new BankResponseDTO();

        dto.setId(bank.getId());
        dto.setBankName(bank.getBankName());
        dto.setRoiRange(bank.getRoiMin() + "% - " + bank.getRoiMax() + "%");
        dto.setProcessingDays(bank.getProcessingDays());
        dto.setMaxLtv(bank.getMaxLtv());
        dto.setMaxTenureMonths(bank.getMaxTenureMonths());
        dto.setFeatures(bank.getFeatures() != null ? bank.getFeatures() : List.of());
        dto.setCasesThisMonth(bank.getCasesThisMonth());
        dto.setStatus(bank.getStatus());

        return dto;
    }
}