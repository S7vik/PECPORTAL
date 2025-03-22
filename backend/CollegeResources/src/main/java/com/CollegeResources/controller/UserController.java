package com.CollegeResources.controller;


import com.CollegeResources.config.EmailService;
import com.CollegeResources.config.JwtTokenProvider;
import com.CollegeResources.dto.LoginRequest;
import com.CollegeResources.dto.LoginResponse;
import com.CollegeResources.dto.SignupRequest;
import com.CollegeResources.model.Role;
import com.CollegeResources.model.User;
import com.CollegeResources.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@RestController
@RequestMapping("api/user")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final String ADMIN_EMAIL="ajinkyashivpure@gmail.com";

    private final  HashMap<String ,String> otpStore=new HashMap<>();

    UserRepository userRepository;

    EmailService emailService;

    JwtTokenProvider jwtTokenProvider;

    PasswordEncoder passwordEncoder;

    public UserController(UserRepository userRepository, JwtTokenProvider jwtTokenProvider, PasswordEncoder passwordEncoder, EmailService emailService) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.jwtTokenProvider = jwtTokenProvider;
        this.emailService = emailService;
    }

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody SignupRequest signupRequest) {
        if (userRepository.findByEmail(signupRequest.getEmail()) != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email already exists");
        }

        String otp = String.valueOf((int) (Math.random() * 9000) + 1000);
        otpStore.put(signupRequest.getEmail(), otp);
        emailService.sendOtpEmail(signupRequest.getEmail(), otp);

        otpStore.put(signupRequest.getEmail() + "_data",
                signupRequest.getName() + "," + passwordEncoder.encode(signupRequest.getPassword()));

        return ResponseEntity.ok("OTP sent to " + signupRequest.getEmail());
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestParam String email, @RequestParam String otp) {
        String storedOtp = otpStore.get(email);
        if (storedOtp != null && storedOtp.equals(otp)) {
            otpStore.remove(email);

            String[] userData = otpStore.get(email + "_data").split(",");
            String name = userData[0];
            String encodedPassword = userData[1];

            Role role= email.equalsIgnoreCase("admin") ? Role.ADMIN : Role.USER;

            User user = new User();
            user.setName(name);
            user.setEmail(email);
            user.setPassword(encodedPassword);
            user.setRole(role);
            userRepository.save(user);

            otpStore.remove(email + "_data");
            return ResponseEntity.ok("Signup complete. Redirecting to dashboard...");
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or expired OTP.");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail());
        if (user == null || !passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid email or password");
        }

        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .authorities(user.getRole().name())
                .build();

        String token=jwtTokenProvider.generateToken(userDetails);
        return ResponseEntity.ok(new LoginResponse(token));

    }

}
