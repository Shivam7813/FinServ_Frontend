package com.finserv.service;

import com.finserv.dto.*;

import java.util.List;

public interface UserService {

    UserResponseDTO registerUser(RegisterRequestDTO dto);

    UserResponseDTO getUserByEmail(String email);

    List<UserResponseDTO> getAllUsers();

    UserResponseDTO getUserById(Long id);

    List<UserResponseDTO> searchUsersByName(String name);

    UserResponseDTO updateUser(Long userId, RegisterRequestDTO dto);

    void deleteUser(Long userId);

    List<CustomerDashboardDTO> getDashboard();
    //------------------------------------------------------------------
    UserResponseDTO registerAdmin(AdminRegisterDTO dto);

    UserResponseDTO registerBank(BankRegisterDTO dto);


}