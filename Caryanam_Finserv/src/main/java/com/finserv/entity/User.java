package com.finserv.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.finserv.enums.Role;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;

    private String mobileNumber;

    private String password;

    private String resetPasswordToken;

    @Enumerated(EnumType.STRING)
    private Role role;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private PersonalDetails personalDetails;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private EmploymentDetails employmentDetails;

    @OneToMany(mappedBy = "user")
    private List<LoanApplication> loanApplications;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonManagedReference
    private Address address;
    private String fullName;
    private String bankName;
    private String branchName;
    private String employeeId;

    private LocalDateTime createdAt;



}