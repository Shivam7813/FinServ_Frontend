package com.finserv.dto;

import lombok.Data;

@Data
public class UserBasicUpdateDTO {

    private Long id;
    private String fullName;
    private String email;
}
