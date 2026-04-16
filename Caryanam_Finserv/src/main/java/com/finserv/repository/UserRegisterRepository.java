package com.finserv.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.finserv.entity.UserRegister;

public interface UserRegisterRepository extends JpaRepository<UserRegister, Long> {

    // 🔹 Check email exists
    boolean existsByEmail(String email);

    // 🔹 Check mobile exists
    boolean existsByMobileNumber(String mobileNumber);

    // 🔹 Find user by mobile (for OTP verify)
    Optional<UserRegister> findByMobileNumber(String mobileNumber);
}