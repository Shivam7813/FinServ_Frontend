package com.finserv.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.finserv.enums.EmploymentType;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "employment_details")
@Data
public class EmploymentDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private EmploymentType employmentType;

    // --- SALARIED ---
    private String companyName;
    private Integer workExperience;
    private Double monthlySalary;

    // --- SELF EMPLOYED ---
    private String businessName;
    private Double annualIncome;
    private String businessType;

    @JsonIgnore
    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
}