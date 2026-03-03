package com.a11y.auditor.model;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
public class AuditHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    // Inside AuditHistory class
    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private AppUser user;
    @Column(name = "url", length = 2048, nullable = false)
    private String url;
    private int totalViolations;
    private LocalDateTime scanDate;

    @Transient // This means: "Don't save this to the DB, just use it for the API"
    private List<A11yViolation> detailedViolations;

    // We will populate this on the fly when sending data to the UI
    // We will store the full report as a Large Object (clob/text)
    @Column(columnDefinition = "LONGTEXT")
    private String rawJsonResult;

    public List<Object> getIssues() {
        try {
            if (this.rawJsonResult == null || this.rawJsonResult.isEmpty()) {
                return List.of();
            }
            ObjectMapper mapper = new ObjectMapper();
            // Convert the string back into a List of objects for the frontend
            return mapper.readValue(this.rawJsonResult, new TypeReference<List<Object>>() {});
        } catch (Exception e) {
            return List.of();
        }
    }
}