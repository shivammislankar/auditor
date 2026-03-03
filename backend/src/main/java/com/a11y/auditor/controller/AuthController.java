package com.a11y.auditor.controller;

import com.a11y.auditor.config.JwtUtils;
import com.a11y.auditor.dto.JwtResponse;
import com.a11y.auditor.dto.LoginRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import com.a11y.auditor.model.AppUser;
import com.a11y.auditor.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder; // Add this

    public AuthController(AuthenticationManager authenticationManager, JwtUtils jwtUtils,UserRepository userRepository,PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
        this.userRepository=userRepository;
        this.passwordEncoder=passwordEncoder;

    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        // 1. Verify username and password
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
        );

        // 2. If successful, put the user in the security context
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 3. Generate the actual String token
        String jwt = jwtUtils.generateToken(authentication.getName());

        // 4. Send it back to React
        return ResponseEntity.ok(new JwtResponse(jwt));
    }
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody AppUser user) {
        // 1. Check if username exists
        if (userRepository.existsByUsername(user.getUsername())) {
            return ResponseEntity.badRequest().body("Error: Username is already taken!");
        }

        // 2. Check if email exists (Good practice!)
        // You might need to add 'existsByEmail' to your UserRepository.java
        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }


        // 3. Encode password and set defaults
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole("ROLE_USER");

        // 4. Save (This now includes the email field automatically)
        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully!");
    }
}
