package com.finserv.service;

import com.finserv.dto.UserRegisterDTO;

public interface UserRegisterService {
    UserRegisterDTO registerUser(UserRegisterDTO dto);
    String verifyOtp(String mobileNumber, String otp);
}
