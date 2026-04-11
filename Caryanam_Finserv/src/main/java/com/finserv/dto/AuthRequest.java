package com.finserv.dto;

import lombok.Data;

@Data
public class AuthRequest {
    private String email;  // OR email (see below)
    private String password;
}