package com.finserv.controller;
import com.finserv.configuration.JwtUtil;
import com.finserv.dto.AuthRequest;
import com.finserv.dto.ResponseDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authManager;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<ResponseDto<String>> login(@RequestBody AuthRequest request) {

        try {
            Authentication authentication = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()));

            UserDetails userDetails =
                    (UserDetails) authentication.getPrincipal();

            String role = userDetails.getAuthorities()
                    .stream()
                    .findFirst()
                    .get()
                    .getAuthority();

            String token = jwtUtil.generateToken(
                    userDetails.getUsername(), role);

            return ResponseEntity.ok(
                    new ResponseDto<>(true,
                            "Login Successful", token));

        } catch (Exception e) {
            e.printStackTrace();  //  VERY IMPORTANT
            return ResponseEntity.internalServerError()
                    .body(new ResponseDto<>(false, e.getMessage(), null));
        }
    }  }