package com.finserv.dto;

import lombok.Data;

@Data
public class UserAuthDTO {

    private String email;
    private String password;
    private String role;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public UserAuthDTO(String email, String password, String role) {
        this.email = email;
        this.password = password;
        this.role = role;
    }
}
