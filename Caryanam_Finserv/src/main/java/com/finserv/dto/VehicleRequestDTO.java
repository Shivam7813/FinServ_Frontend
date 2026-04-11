package com.finserv.dto;

import lombok.Data;

@Data
public class VehicleRequestDTO {


    private Long loanId;
    private String carMake;
    private String model;
    private String variant;

    private String dealerName;
    private String dealerLocation;

    private Double exShowroomPrice;
    private Double onRoadPrice;
}