package com.a11y.auditor.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Data
public class AppUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    // --- ADD THIS LINE ---
    @Column(unique = true)
    private String email;
    @Column(unique = true)
    private String username;
    private String password;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<AuditHistory> audits;
    private String role;
}