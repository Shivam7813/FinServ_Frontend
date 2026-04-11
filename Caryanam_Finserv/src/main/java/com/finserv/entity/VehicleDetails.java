package com.finserv.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class VehicleDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String carMake;
    private String model;
    private String variant;

    private String dealerName;
    private String dealerLocation;

    private Double exShowroomPrice;
    private Double onRoadPrice;

    private Double ltv;

    @OneToOne
    @JoinColumn(name = "loan_id", nullable = false)
    private LoanApplication loanApplication;
}