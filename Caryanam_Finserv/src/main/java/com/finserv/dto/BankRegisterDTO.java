package com.finserv.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class BankRegisterDTO {

    private String fullName;
    private String email;
    private String mobileNumber;
    private String password;
    private String bankName;
    private String branchName;
    private String employeeId;

    private String role; // bank

}