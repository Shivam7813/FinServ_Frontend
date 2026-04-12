package com.finserv.entity;

import com.finserv.enums.LoanStatus;
import com.finserv.enums.LoanType;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Entity
@Data
public class LoanApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String caseNumber;

    @Enumerated(EnumType.STRING)
    private LoanType loanType;

    private Double loanAmount;

    private Double downPayment;

    private Integer tenure;

    @Enumerated(EnumType.STRING)
    private LoanStatus status;

    private LocalDate createdDate;
    private Boolean isDeleted = false;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "loanApplication", cascade = CascadeType.ALL)
    private List<Document> documents;

    @OneToOne(mappedBy = "loanApplication", cascade = CascadeType.ALL)
    private VehicleDetails vehicle;

    @Column(name = "updated_date")
    private LocalDate updatedDate;

    @ManyToOne
    @JoinColumn(name = "bank_id")
    private Bank bank;



}