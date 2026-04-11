package com.finserv.serviceImpl;

import com.finserv.dto.VehicleRequestDTO;
import com.finserv.dto.VehicleResponseDTO;
import com.finserv.entity.LoanApplication;
import com.finserv.entity.VehicleDetails;
import com.finserv.exception.ResourceNotFoundException;
import com.finserv.repository.LoanApplicationRepository;
import com.finserv.repository.VehicleRepository;
import com.finserv.service.VehicleService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class VehicleServiceImpl implements VehicleService {

    @Autowired
    private VehicleRepository vehicleRepo;

    @Autowired
    private LoanApplicationRepository loanRepo;

    // ✅ SAVE VEHICLE
    @Override
    public VehicleResponseDTO saveVehicle(Long loanId, VehicleRequestDTO dto) {

        LoanApplication loan = loanRepo.findById(loanId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Loan not found with id: " + loanId));

        VehicleDetails vehicle = vehicleRepo.findByLoanApplicationId(loanId)
                .orElse(new VehicleDetails());

        vehicle.setCarMake(dto.getCarMake());
        vehicle.setModel(dto.getModel());
        vehicle.setVariant(dto.getVariant());
        vehicle.setDealerName(dto.getDealerName());
        vehicle.setDealerLocation(dto.getDealerLocation());
        vehicle.setExShowroomPrice(dto.getExShowroomPrice());
        vehicle.setOnRoadPrice(dto.getOnRoadPrice());

        // 🔥 LTV Calculation
        if (dto.getOnRoadPrice() > 0 && loan.getLoanAmount() != null) {
            double ltv = (loan.getLoanAmount() / dto.getOnRoadPrice()) * 100;
            vehicle.setLtv(ltv);
        }

        vehicle.setLoanApplication(loan);

        return mapToDTO(vehicleRepo.save(vehicle));
    }

    // ✅ GET VEHICLE
    @Override
    public VehicleResponseDTO getVehicle(Long loanId) {

        VehicleDetails vehicle = vehicleRepo.findByLoanApplicationId(loanId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Vehicle not found for loanId: " + loanId));

        return mapToDTO(vehicle);
    }

    // 🔄 MAPPER
    private VehicleResponseDTO mapToDTO(VehicleDetails v) {

        VehicleResponseDTO dto = new VehicleResponseDTO();

        dto.setId(v.getId());
        dto.setCarMake(v.getCarMake());
        dto.setModel(v.getModel());
        dto.setVariant(v.getVariant());
        dto.setDealerName(v.getDealerName());
        dto.setDealerLocation(v.getDealerLocation());
        dto.setExShowroomPrice(v.getExShowroomPrice());
        dto.setOnRoadPrice(v.getOnRoadPrice());
        dto.setLtv(v.getLtv());

        return dto;
    }
}