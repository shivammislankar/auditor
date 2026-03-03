package com.a11y.auditor.model;

import lombok.Data;
import java.util.List;

@Data
public class A11yViolation {
    private String id;          // e.g., "color-contrast"
    private String impact;      // e.g., "critical"
    private String description; // What is wrong?
    private String help;        // How to fix it
    private List<String> tags;
    private List<Node> nodes;   // The specific HTML elements failing

    @Data
    public static class Node {
        private List<String> target; // The CSS selector (e.g., ["#login-btn"])
        private String html;         // The actual broken HTML code
    }
}