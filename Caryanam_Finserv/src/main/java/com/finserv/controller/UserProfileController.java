package com.finserv.controller;

import com.finserv.dto.UserProfileDTO;
import com.finserv.service.UserProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class UserProfileController {


@Autowired
private UserProfileService service;

@PostMapping("/save")
public ResponseEntity<String> saveProfile(@RequestBody UserProfileDTO dto) {

    if (dto.getUserId() == null) {
        return ResponseEntity.badRequest().body("User ID is required");
    }

    service.saveUserProfile(dto);
    return ResponseEntity.ok("Profile saved successfully");
}


}
