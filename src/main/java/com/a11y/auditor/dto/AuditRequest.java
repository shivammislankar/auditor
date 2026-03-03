package com.a11y.auditor.dto;

import lombok.Data;

@Data
public class AuditRequest {
    private String url;
    private String loginUrl;
    private String siteUser;
    private String sitePass;
    private boolean crawlSite; // Let the user choose if they want 1 page or the whole site
}