package com.finserv.controller;

import com.finserv.dto.VehicleRequestDTO;
import com.finserv.dto.VehicleResponseDTO;
import com.finserv.exception.BadRequestException;
import com.finserv.service.VehicleService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/vehicle")
public class VehicleController {

    @Autowired
    private VehicleService vehicleService;

    // ✅ SAVE VEHICLE (BODY BASED)
    @PostMapping("/add")
    public ResponseEntity<VehicleResponseDTO> saveVehicle(
            @RequestBody VehicleRequestDTO dto) {

        // 0️⃣ DTO NULL CHECK
        if (dto == null) {
            throw new BadRequestException("Request body is missing");
        }

        // 1️⃣ Loan ID (NOW FROM BODY)
        if (dto.getLoanId() == null || dto.getLoanId() <= 0) {
            throw new BadRequestException("Invalid loan ID");
        }

        // 2️⃣ Car Make
        if (dto.getCarMake() == null || dto.getCarMake().isBlank()) {
            throw new BadRequestException("Car make is required");
        }

        if (dto.getCarMake().length() < 2 || dto.getCarMake().length() > 30) {
            throw new BadRequestException("Car make must be 2-30 characters");
        }

        if (!dto.getCarMake().matches("^[A-Za-z ]+$")) {
            throw new BadRequestException("Car make must contain only letters");
        }

        // 3️⃣ Model
        if (dto.getModel() == null || dto.getModel().isBlank()) {
            throw new BadRequestException("Model is required");
        }

        if (dto.getModel().length() > 30) {
            throw new BadRequestException("Model too long");
        }

        // 4️⃣ Variant
        if (dto.getVariant() == null || dto.getVariant().isBlank()) {
            throw new BadRequestException("Variant is required");
        }

        // 5️⃣ Dealer Name
        if (dto.getDealerName() == null || dto.getDealerName().isBlank()) {
            throw new BadRequestException("Dealer name is required");
        }

        if (dto.getDealerName().length() > 100) {
            throw new BadRequestException("Dealer name too long");
        }

        // 6️⃣ Dealer Location
        if (dto.getDealerLocation() == null || dto.getDealerLocation().isBlank()) {
            throw new BadRequestException("Dealer location is required");
        }

        if (dto.getDealerLocation().length() < 2) {
            throw new BadRequestException("Dealer location invalid");
        }

        // 7️⃣ Ex-showroom Price
        if (dto.getExShowroomPrice() == null) {
            throw new BadRequestException("Ex-showroom price is required");
        }

        if (dto.getExShowroomPrice() <= 0) {
            throw new BadRequestException("Ex-showroom price must be greater than 0");
        }

        if (dto.getExShowroomPrice() > 1_00_00_000) {
            throw new BadRequestException("Ex-showroom price too high");
        }

        // 8️⃣ On-road Price
        if (dto.getOnRoadPrice() == null) {
            throw new BadRequestException("On-road price is required");
        }

        if (dto.getOnRoadPrice() <= 0) {
            throw new BadRequestException("On-road price must be greater than 0");
        }

        if (dto.getOnRoadPrice() < dto.getExShowroomPrice()) {
            throw new BadRequestException("On-road price cannot be less than ex-showroom price");
        }

        if (dto.getOnRoadPrice() > 2_00_00_000) {
            throw new BadRequestException("On-road price too high");
        }

        return ResponseEntity.status(201)
                .body(vehicleService.saveVehicle(dto.getLoanId(), dto));
    }

    // ✅ GET VEHICLE (BODY BASED)
    @PostMapping("/get")
    public ResponseEntity<VehicleResponseDTO> getVehicle(
            @RequestBody VehicleRequestDTO dto) {

        if (dto.getLoanId() == null || dto.getLoanId() <= 0) {
            throw new BadRequestException("Invalid loan ID");
        }

        return ResponseEntity.ok(vehicleService.getVehicle(dto.getLoanId()));
    }
}