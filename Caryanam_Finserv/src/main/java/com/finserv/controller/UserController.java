package com.finserv.controller;

import com.finserv.dto.*;
import com.finserv.enums.EmploymentType;
import com.finserv.exception.BadRequestException;
import com.finserv.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserService userService;

    //  REGISTER USER (ALL VALIDATION HERE)
    @PostMapping("/users")
    public ResponseEntity<UserResponseDTO> registerUser(
            @RequestBody RegisterRequestDTO dto) {

        // 1️⃣ EMAIL
        if (dto.getEmail() == null || dto.getEmail().isBlank())
            throw new BadRequestException("Email is required");

        if (!dto.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$"))
            throw new BadRequestException("Invalid email format");

        // 2️⃣ MOBILE
        if (dto.getMobileNumber() == null || dto.getMobileNumber().isBlank())
            throw new BadRequestException("Mobile number is required");

        if (!dto.getMobileNumber().matches("^[0-9]{10}$"))
            throw new BadRequestException("Mobile must be 10 digits");

        // 3️⃣ PASSWORD
        if (dto.getPassword() == null || dto.getPassword().isBlank())
            throw new BadRequestException("Password is required");

        if (!dto.getPassword().matches("^(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+=]).{6,}$"))
            throw new BadRequestException("Weak password");

        // 4️⃣ ROLE
        if (dto.getRole() == null)
            throw new BadRequestException("Role is required");

        // 5️⃣ PERSONAL DETAILS
        if (dto.getFullName() == null || dto.getFullName().isBlank())
            throw new BadRequestException("Full name is required");

        if (dto.getFullName().length() < 3 || dto.getFullName().length() > 50)
            throw new BadRequestException("Name must be 3 to 50 characters");

        if (dto.getDateOfBirth() == null)
            throw new BadRequestException("Date of Birth is required");

        if (dto.getDateOfBirth().isAfter(java.time.LocalDate.now()))
            throw new BadRequestException("DOB must be in past");

        // PAN
        if (dto.getPanNumber() == null || dto.getPanNumber().isBlank())
            throw new BadRequestException("PAN is required");

        if (!dto.getPanNumber().matches("^[A-Z]{5}[0-9]{4}[A-Z]{1}$"))
            throw new BadRequestException("Invalid PAN format");

        // Aadhaar
        if (dto.getAadhaarNumber() == null || dto.getAadhaarNumber().isBlank())
            throw new BadRequestException("Aadhaar is required");

        if (!dto.getAadhaarNumber().matches("^[0-9]{12}$"))
            throw new BadRequestException("Invalid Aadhaar");

        // 🔥 EXTRA (missing earlier)
        if (dto.getMobileNumber() == null || !dto.getMobileNumber().matches("^[0-9]{10}$"))
            throw new BadRequestException("Invalid mobile number");

        // 6️⃣ ADDRESS
        if (dto.getAddressLine1() == null || dto.getAddressLine1().isBlank())
            throw new BadRequestException("Address Line 1 is required");

        if (dto.getAddressLine1().length() < 5)
            throw new BadRequestException("Address Line 1 too short");

        if (dto.getCity() == null || dto.getCity().isBlank())
            throw new BadRequestException("City is required");

        if (dto.getPincode() == null || dto.getPincode().isBlank())
            throw new BadRequestException("Pincode is required");

        if (!dto.getPincode().matches("^[1-9][0-9]{5}$"))
            throw new BadRequestException("Invalid pincode");

        if (dto.getState() == null)
            throw new BadRequestException("State is required");

        // 7️⃣ EMPLOYMENT
        if (dto.getEmploymentType() == null)
            throw new BadRequestException("Employment type is required");

        // SALARIED
        if (dto.getEmploymentType() == EmploymentType.SALARIED) {

            if (dto.getCompanyName() == null || dto.getCompanyName().isBlank())
                throw new BadRequestException("Company name required");

            if (dto.getMonthlySalary() == null || dto.getMonthlySalary() <= 0)
                throw new BadRequestException("Valid salary required");

            if (dto.getWorkExperience() == null || dto.getWorkExperience() < 0)
                throw new BadRequestException("Valid work experience required");
        }

        // BUSINESS / SELF EMPLOYED
        if (dto.getEmploymentType() == EmploymentType.BUSINESS ||
                dto.getEmploymentType() == EmploymentType.SELF_EMPLOYED) {

            if (dto.getBusinessName() == null || dto.getBusinessName().isBlank())
                throw new BadRequestException("Business name required");

            if (dto.getAnnualIncome() == null || dto.getAnnualIncome() <= 0)
                throw new BadRequestException("Valid annual income required");
        }

        return ResponseEntity.status(201).body(userService.registerUser(dto));
    }

    // GET ALL
    @GetMapping("/users")
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // GET BY ID
    @PostMapping("/users/get-by-id")
    public ResponseEntity<UserResponseDTO> getUserById(
            @RequestBody IdRequestDTO request) {

        // 1️⃣ DTO null
        if (request == null) {
            throw new BadRequestException("Request body is missing");
        }

        // 2️⃣ ID validation
        if (request.getId() == null || request.getId() <= 0) {
            throw new BadRequestException("Invalid ID");
        }

        return ResponseEntity.ok(userService.getUserById(request.getId()));
    }

    // DELETE
    @DeleteMapping("/users/delete")
    public ResponseEntity<String> deleteUser(
            @RequestBody IdRequestDTO request) {

        // 1️⃣ Request null
        if (request == null) {
            throw new BadRequestException("Request body is missing");
        }

        // 2️⃣ ID validation
        if (request.getId() == null || request.getId() <= 0) {
            throw new BadRequestException("Invalid ID");
        }

        userService.deleteUser(request.getId());

        return ResponseEntity.ok("User deleted successfully");
    }

    // SEARCH
    @PostMapping("/users/search")
    public ResponseEntity<List<UserResponseDTO>> searchUsers(
            @RequestBody SearchRequestDTO request) {

        // 1️⃣ Request null
        if (request == null) {
            throw new BadRequestException("Request body is missing");
        }

        // 2️⃣ Name validation
        if (request.getName() == null || request.getName().isBlank()) {
            throw new BadRequestException("Name is required");
        }

        // 🔥 EXTRA (length validation)
        if (request.getName().length() < 2 || request.getName().length() > 50) {
            throw new BadRequestException("Name must be 2-50 characters");
        }

        return ResponseEntity.ok(
                userService.searchUsersByName(request.getName())
        );
    }

    @PutMapping("/users/basic")
    public ResponseEntity<UserResponseDTO> updateUserBasic(
            @RequestBody UserBasicUpdateDTO body) {

        if (body == null) {
            throw new BadRequestException("Request body is missing");
        }
        if (body.getId() == null || body.getId() <= 0) {
            throw new BadRequestException("Invalid user ID");
        }

        return ResponseEntity.ok(userService.updateUserBasic(body));
    }

    // DASHBOARD
    @GetMapping("/users/dashboard")
    public ResponseEntity<List<CustomerDashboardDTO>> getDashboard() {
        return ResponseEntity.ok(userService.getDashboard());
    }
}