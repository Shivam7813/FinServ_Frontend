package com.finserv.dto;

import lombok.Data;

import java.time.LocalDate;

@Data

public class AdminRegisterDTO {

    private String fullName;
    private String email;
    private String mobileNumber;
    private String password;

    private String role; // ADMIN
}
