package com.a11y.auditor.dto;

import lombok.Data;
import lombok.AllArgsConstructor;

@Data
@AllArgsConstructor
public class JwtResponse {
    private String token;
    private String type = "Bearer";

    // Constructor for just the token
    public JwtResponse(String accessToken) {
        this.token = accessToken;
    }
}