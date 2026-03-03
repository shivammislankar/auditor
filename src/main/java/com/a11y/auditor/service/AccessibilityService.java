package com.a11y.auditor.service;

import com.a11y.auditor.model.A11yViolation;
import com.a11y.auditor.model.AuditHistory; // Add this
import com.a11y.auditor.repository.AuditRepository; // Add this
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.microsoft.playwright.*;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import com.a11y.auditor.model.AppUser;
import com.a11y.auditor.repository.UserRepository;
import com.microsoft.playwright.options.*;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime; // Add this
import java.util.List;

@Service
public class AccessibilityService {
    private final UserRepository userRepository;
    private final AuditRepository auditRepository;
    private final ObjectMapper mapper = new ObjectMapper()
            .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    private final EmailService emailService;

    public AccessibilityService(AuditRepository auditRepository,EmailService emailService, UserRepository userRepository) {
        this.auditRepository = auditRepository;
        this.userRepository = userRepository;
        this.emailService=emailService;
    }
    @Async
    public void runSiteWideAudit(String startUrl, String username, String loginUrl, String siteUser, String sitePass) {
        int totalViolationsFound = 0; // Track the sum for the whole site

        try (Playwright playwright = Playwright.create()) {
            Browser browser = playwright.chromium().launch(new BrowserType.LaunchOptions().setHeadless(true));
            BrowserContext context = browser.newContext();
            Page page = context.newPage();

            // STEP 1: LOGIN BYPASS
            if (loginUrl != null && !loginUrl.isEmpty()) {
                page.navigate(loginUrl);
                page.fill("input[name='username']", siteUser);
                page.fill("input[name='password']", sitePass);
                page.click("button[type='submit']");
                page.waitForLoadState(LoadState.NETWORKIDLE);
            }

            // STEP 2: CRAWLER
            page.navigate(startUrl);
            List<String> pagesToScan = (List<String>) page.evaluate(
                    "Array.from(document.querySelectorAll('a')).map(a => a.href)" +
                            ".filter(href => href.startsWith(window.location.origin))"
            );

            java.util.Set<String> uniquePages = new java.util.HashSet<>(pagesToScan);
            uniquePages.add(startUrl);

            // STEP 3: LOOP AND SUM
            for (String url : uniquePages) {
                // We capture the int returned by the helper method
                int count = performSinglePageAudit(page, url, username);
                totalViolationsFound += count;
            }

            browser.close();

            // STEP 4: SEND ONE SUMMARY EMAIL
            AppUser user = userRepository.findByUsername(username).orElseThrow();
            emailService.sendAuditCompletionEmail(user.getEmail(), startUrl, totalViolationsFound);

        } catch (Exception e) {
            System.err.println("Audit failed: " + e.getMessage());
            e.printStackTrace();
        }
    }

    // Helper method to keep code clean
    private int performSinglePageAudit(Page page, String url, String username) throws Exception {
        page.navigate(url);
        String axeSource = new String(Files.readAllBytes(Paths.get("src/main/resources/axe.min.js")));
        page.evaluate(axeSource);

        Object results = page.evaluate("axe.run().then(res => res.violations)");
        List<A11yViolation> violations = mapper.convertValue(results, new TypeReference<List<A11yViolation>>() {});

        // 1. Create the History object
        AuditHistory history = new AuditHistory();
        history.setUrl(url);
        history.setTotalViolations(violations.size());
        history.setScanDate(LocalDateTime.now());
        history.setRawJsonResult(mapper.writeValueAsString(violations));

        // 2. Fetch the user
        AppUser user = userRepository.findByUsername(username).orElseThrow();
        history.setUser(user);

        // 3. Save it ONCE and capture the saved version
        AuditHistory savedAudit = auditRepository.save(history);

        // 4. Trigger the email using 'savedAudit' and 'user'
        try {
            emailService.sendAuditCompletionEmail(
                    user.getEmail(), // Make sure this getter exists in AppUser
                    savedAudit.getUrl(),
                    savedAudit.getTotalViolations()
            );
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
        return violations.size();
    }

}