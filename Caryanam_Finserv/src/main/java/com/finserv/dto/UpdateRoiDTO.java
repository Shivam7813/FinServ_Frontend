package com.finserv.dto;

import lombok.Data;

@Data
public class UpdateRoiDTO {
    //update roi id
    private Long bankid;
    private Double roiMin;
    private Double roiMax;
}