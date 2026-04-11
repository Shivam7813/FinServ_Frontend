package com.finserv.service;

import com.finserv.dto.VehicleRequestDTO;
import com.finserv.dto.VehicleResponseDTO;

public interface VehicleService {

    VehicleResponseDTO saveVehicle(Long loanId, VehicleRequestDTO dto);

    VehicleResponseDTO getVehicle(Long loanId);
}
