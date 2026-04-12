package com.finserv.controller;

import com.finserv.dto.OtpVerifyResponseDTO;
import com.finserv.dto.UserRegisterDTO;
import com.finserv.dto.reportDTO.OtpRequestDTO;
import com.finserv.exception.BadRequestException;
import com.finserv.service.UserRegisterService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class UserRegisterController {

    @Autowired
    private UserRegisterService userRegisterService;

    // ================= USER REGISTER =================
    @PostMapping("/user/register")
    public ResponseEntity<UserRegisterDTO> registerUser(
            @Valid @RequestBody UserRegisterDTO dto) {

        // ✅ NULL CHECK
        if (dto == null) {
            throw new BadRequestException("Request body is missing");
        }

        // ✅ MOBILE VALIDATION
        if (dto.getMobileNumber() == null || dto.getMobileNumber().isBlank()) {
            throw new BadRequestException("Mobile number is required");
        }

        if (!dto.getMobileNumber().matches("^[0-9]{10}$")) {
            throw new BadRequestException("Mobile number must be 10 digits");
        }

        // ✅ NAME (if present)
        if (dto.getFullName() != null && !dto.getFullName().isBlank()) {
            if (dto.getFullName().length() < 3 || dto.getFullName().length() > 50) {
                throw new BadRequestException("Name must be 3 to 50 characters");
            }
        }

        // ✅ EMAIL (optional but valid if present)
        if (dto.getEmail() != null && !dto.getEmail().isBlank()) {
            if (!dto.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
                throw new BadRequestException("Invalid email format");
            }
        }

        UserRegisterDTO response = userRegisterService.registerUser(dto);
        return ResponseEntity.ok(response);
    }

    // ================= VERIFY OTP =================
    @PostMapping("/verify-otp")
    public ResponseEntity<OtpVerifyResponseDTO> verifyOtp(
            @Valid @RequestBody OtpRequestDTO request) {

        // ✅ NULL CHECK
        if (request == null) {
            throw new BadRequestException("Request body is missing");
        }

        // ✅ MOBILE VALIDATION
        if (request.getMobileNumber() == null || request.getMobileNumber().isBlank()) {
            throw new BadRequestException("Mobile number is required");
        }

        if (!request.getMobileNumber().matches("^[0-9]{10}$")) {
            throw new BadRequestException("Invalid mobile number");
        }

        // ✅ OTP VALIDATION
        if (request.getOtp() == null || request.getOtp().isBlank()) {
            throw new BadRequestException("OTP is required");
        }

        if (!request.getOtp().matches("^[0-9]{4,6}$")) {
            throw new BadRequestException("OTP must be 4 to 6 digits");
        }

        String msg = userRegisterService.verifyOtp(
                request.getMobileNumber(),
                request.getOtp()
        );

        return ResponseEntity.ok(
                new OtpVerifyResponseDTO(msg, request.getMobileNumber())
        );
    }
}