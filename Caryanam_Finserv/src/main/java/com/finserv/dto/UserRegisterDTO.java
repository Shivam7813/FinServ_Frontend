package com.finserv.dto;

import com.finserv.enums.Role;
import lombok.Data;

@Data
public class UserRegisterDTO {
    private String fullName;
    private String email;
    private String mobileNumber;
    private String password;
    private Role role;  //user




    // getters & setters
}
