package com.a11y.auditor.config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtils {
    // In a real app, move this to application.properties
    private final String jwtSecret = "your-very-secure-and-very-long-secret-key-that-is-32-chars";
    private final int jwtExpirationMs = 86400000; // 24 hours

    private final Key key = Keys.hmacShaKeyFor(jwtSecret.getBytes());

    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // Inside JwtUtils.java

    public String getUsernameFromToken(String token) {
        return Jwts.parser()
                .verifyWith((javax.crypto.SecretKey) key) // Updated for 0.12.x
                .build()
                .parseSignedClaims(token) // Updated method name
                .getPayload() // .getBody() is now .getPayload()
                .getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith((javax.crypto.SecretKey) key)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}