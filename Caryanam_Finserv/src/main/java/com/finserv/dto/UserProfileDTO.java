package com.finserv.dto;

import lombok.Data;

@Data
public class UserProfileDTO {


private Long userId;

// PERSONAL
private String fullName;
private String dateOfBirth;
private String panNumber;
private String aadhaarNumber;
private String mobileNumber;
private String email;

// EMPLOYMENT
private String employmentType; // SALARIED / SELF_EMPLOYED
private String companyName;
private Integer workExperience;
private Double monthlySalary;

private String businessName;
private Double annualIncome;
private String businessType;

// ADDRESS
private String addressLine1;
private String addressLine2;
private String city;
private String state;
private String pincode;


}
