package com.finserv.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Table(name = "banks")
@Data
public class Bank {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String bankName;

    private double roiMin;

    private double roiMax;

    private String processingDays;

    private int maxLtv;

    private int maxTenureMonths;

    @ElementCollection
    private List<String> features;

    private int casesThisMonth;

    private String status;
}