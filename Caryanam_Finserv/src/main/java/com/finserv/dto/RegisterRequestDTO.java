package com.finserv.dto;

import com.finserv.enums.*;
import lombok.Data;

import java.time.LocalDate;

@Data
public class RegisterRequestDTO {

    private String email;
    private String mobileNumber;
    private String password;
    private Role role;

    private String fullName;
    private LocalDate dateOfBirth;
    private String panNumber;
    private String aadhaarNumber;

    private String addressLine1;
    private String addressLine2;
    private String city;
    private String pincode;
    private State state;

    private EmploymentType employmentType;

    private String companyName;
    private Integer workExperience;
    private Double monthlySalary;

    private String businessName;
    private Double annualIncome;
    private String businessType;



}