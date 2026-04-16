package com.finserv.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "users")
@Data
public class UserRegister {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 🔹 Basic Details
    private String fullName;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(unique = true, nullable = false)
    private String mobileNumber;

    private String password;

    private String role;

    // 🔹 OTP Fields
    private String otp;

    private LocalDateTime otpExpiry;

    private boolean isVerified;

    private LocalDateTime createdAt;
}