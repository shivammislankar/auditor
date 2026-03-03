package com.a11y.auditor.controller;

import com.a11y.auditor.dto.AuditRequest; // You'll need to create this DTO
import com.a11y.auditor.model.AuditHistory;
import com.a11y.auditor.service.AccessibilityService;
import com.a11y.auditor.repository.AuditRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/audit")
@CrossOrigin(origins = "http://localhost:5173")
public class AuditController {

    private final AccessibilityService auditService;
    private final AuditRepository auditRepository;

    public AuditController(AccessibilityService auditService, AuditRepository auditRepository) {
        this.auditService = auditService;
        this.auditRepository = auditRepository;
    }

    // CHANGE: Switch from @GetMapping to @PostMapping to handle credentials securely
    @PostMapping("/run")
    public ResponseEntity<?> runAudit(@RequestBody AuditRequest request, Principal principal) {
        try {
            // We call the new site-wide audit method in your service
            auditService.runSiteWideAudit(
                    request.getUrl(),
                    principal.getName(),
                    request.getLoginUrl(),
                    request.getSiteUser(),
                    request.getSitePass()
            );

            return ResponseEntity.accepted().body("Audit started in the background. Refresh your history in a few moments.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Audit failed: " + e.getMessage());
        }
    }

    @GetMapping("/history")
    public List<AuditHistory> getHistory(Principal principal) {
        return auditRepository.findByUserUsername(principal.getName());
    }

    @GetMapping("/{id}")
    public AuditHistory getAuditById(@PathVariable Long id, Principal principal) {
        AuditHistory audit = auditRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Audit not found"));

        if (!audit.getUser().getUsername().equals(principal.getName())) {
            throw new RuntimeException("Unauthorized access to this report");
        }

        return audit;
    }
}