package com.finserv.serviceImpl;

import com.finserv.dto.CustomerDashboardDTO;
import com.finserv.dto.RegisterRequestDTO;
import com.finserv.dto.UserResponseDTO;
import com.finserv.entity.*;
import com.finserv.enums.EmploymentType;
import com.finserv.enums.Role;
import com.finserv.exception.BadRequestException;
import com.finserv.exception.ResourceNotFoundException;
import com.finserv.repository.PersonalDetailsRepository;
import com.finserv.repository.UserRepository;
import com.finserv.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PersonalDetailsRepository personalRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // ✅ REGISTER
    @Override
    @Transactional
    public UserResponseDTO registerUser(RegisterRequestDTO dto) {

        // duplicate email check
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new BadRequestException("Email already exists");
        }

        User user = new User();
        user.setEmail(dto.getEmail());
        user.setMobileNumber(dto.getMobileNumber());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole(dto.getRole() != null ? dto.getRole() : Role.USER);
        user.setCreatedAt(LocalDateTime.now());

        // Personal
        PersonalDetails personal = new PersonalDetails();
        personal.setFullName(dto.getFullName());
        personal.setDateOfBirth(dto.getDateOfBirth());
        personal.setPanNumber(dto.getPanNumber());
        personal.setAadhaarNumber(dto.getAadhaarNumber());
        personal.setMobileNumber(dto.getMobileNumber());
        personal.setEmail(dto.getEmail());

        // Address
        Address address = new Address();
        address.setAddressLine1(dto.getAddressLine1());
        address.setAddressLine2(dto.getAddressLine2());
        address.setCity(dto.getCity());
        address.setPincode(dto.getPincode());
        address.setState(dto.getState());

        // Employment
        EmploymentDetails emp = new EmploymentDetails();
        emp.setEmploymentType(dto.getEmploymentType());

        if (dto.getEmploymentType() == EmploymentType.SALARIED) {
            emp.setCompanyName(dto.getCompanyName());
            emp.setWorkExperience(dto.getWorkExperience());
            emp.setMonthlySalary(dto.getMonthlySalary());
        }

        if (dto.getEmploymentType() == EmploymentType.BUSINESS
                || dto.getEmploymentType() == EmploymentType.SELF_EMPLOYED) {
            emp.setBusinessName(dto.getBusinessName());
            emp.setAnnualIncome(dto.getAnnualIncome());
            emp.setBusinessType(dto.getBusinessType());
        }

        // Relations
        user.setPersonalDetails(personal);
        user.setAddress(address);
        user.setEmploymentDetails(emp);

        personal.setUser(user);
        address.setUser(user);
        emp.setUser(user);

        User saved = userRepository.save(user);

        return mapToDTO(saved);
    }

    // ✅ GET BY EMAIL
    @Override
    public UserResponseDTO getUserByEmail(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return mapToDTO(user);
    }

    // ✅ GET ALL
    @Override
    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ✅ GET BY ID
    @Override
    public UserResponseDTO getUserById(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        return mapToDTO(user);
    }

    // ✅ SEARCH
    @Override
    public List<UserResponseDTO> searchUsersByName(String name) {

        return personalRepo.findByFullNameContainingIgnoreCase(name)
                .stream()
                .map(p -> mapToDTO(p.getUser()))
                .collect(Collectors.toList());
    }

    // ✅ UPDATE
    @Override
    @Transactional
    public UserResponseDTO updateUser(Long id, RegisterRequestDTO dto) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setEmail(dto.getEmail());
        user.setMobileNumber(dto.getMobileNumber());

        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        // Personal
        user.getPersonalDetails().setFullName(dto.getFullName());

        // Address
        user.getAddress().setCity(dto.getCity());

        // Employment
        user.getEmploymentDetails().setEmploymentType(dto.getEmploymentType());

        return mapToDTO(userRepository.save(user));
    }

    // ✅ DELETE
    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    // ✅ DASHBOARD
    @Override
    public List<CustomerDashboardDTO> getDashboard() {
        return userRepository.getDashboardData();
    }

    // 🔥 COMMON MAPPING
    private UserResponseDTO mapToDTO(User user) {
        return UserResponseDTO.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .fullName(
                        user.getPersonalDetails() != null
                                ? user.getPersonalDetails().getFullName()
                                : null
                )
                .role(user.getRole())
                .build();
    }
}