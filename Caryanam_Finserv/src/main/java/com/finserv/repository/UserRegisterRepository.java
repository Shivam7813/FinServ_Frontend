package com.finserv.repository;

import com.finserv.entity.UserRegister;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRegisterRepository extends JpaRepository<UserRegister, Long> {

    // 🔹 Check email exists
    boolean existsByEmail(String email);

    // 🔹 Check mobile exists
    boolean existsByMobileNumber(String mobileNumber);

    // 🔹 Find user by mobile (for OTP verify)
    Optional<UserRegister> findByMobileNumber(String mobileNumber);
}