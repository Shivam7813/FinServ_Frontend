package com.finserv.dto;

import lombok.Data;

@Data
public class OtpVerifyResponseDTO {
    private String message;
    private String mobileNumber;

    // constructor
    public OtpVerifyResponseDTO(String message, String mobileNumber) {
        this.message = message;
        this.mobileNumber = mobileNumber;
    }
}
