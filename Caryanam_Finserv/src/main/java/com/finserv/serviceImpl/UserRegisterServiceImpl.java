package com.finserv.serviceImpl;

import com.finserv.dto.UserRegisterDTO;
import com.finserv.entity.User;
import com.finserv.entity.UserRegister;
import com.finserv.repository.UserRegisterRepository;
import com.finserv.service.UserRegisterService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class UserRegisterServiceImpl implements UserRegisterService {

    @Autowired
    private UserRegisterRepository userRegisterRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // 🔥 REGISTER USER + SEND OTP
    @Override
    public UserRegisterDTO registerUser(UserRegisterDTO dto) {

        if (userRegisterRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        UserRegister user = new UserRegister();
        user.setFullName(dto.getFullName());
        user.setEmail(dto.getEmail());
        user.setMobileNumber(dto.getMobileNumber());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole(String.valueOf(dto.getRole()));
        user.setCreatedAt(LocalDateTime.now());
        // 🔥 OTP Logic
        String otp = generateOtp();
        user.setOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(5));
        user.setVerified(false);

        userRegisterRepository.save(user);

        // 🔥 Send OTP
        sendOtp(user.getMobileNumber(), otp);

        return dto;
    }



    // 🔥 VERIFY OTP
    @Override
    public String verifyOtp(String mobileNumber, String otp) {

        UserRegister user = userRegisterRepository.findByMobileNumber(mobileNumber)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getOtp() == null || !user.getOtp().equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }

        if (user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP expired");
        }

        user.setVerified(true);
        user.setOtp(null);
        user.setOtpExpiry(null);

        userRegisterRepository.save(user);

        return "User verified successfully";
    }


    //USER
    // 🔥 Generate OTP
    private String generateOtp() {
        return String.valueOf(new Random().nextInt(900000) + 100000);
    }

    // 🔥 Send OTP (Dummy / Console OR integrate Twilio/Fast2SMS)
    private void sendOtp(String mobile, String otp) {

        // 👉 FOR TESTING (IMPORTANT)
        System.out.println("OTP for " + mobile + " is: " + otp);

        // 👉 REAL SMS (Uncomment if using Twilio)
        /*
        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);

        Message.creator(
                new PhoneNumber("+91" + mobile),
                new PhoneNumber(TWILIO_NUMBER),
                "Your OTP is: " + otp
        ).create();
        */
    }
}
