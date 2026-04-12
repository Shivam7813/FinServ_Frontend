package com.finserv.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

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