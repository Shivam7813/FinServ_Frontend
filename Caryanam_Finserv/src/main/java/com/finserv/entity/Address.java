package com.finserv.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.finserv.enums.State;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "address")
@Data
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String addressLine1;

    private String addressLine2;

    private String city;

    private String pincode;

    @Enumerated(EnumType.STRING)
    private State state;

    @OneToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;
}