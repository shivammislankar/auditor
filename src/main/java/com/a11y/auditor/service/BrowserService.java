package com.a11y.auditor.service;

import com.microsoft.playwright.*;
import org.springframework.stereotype.Service;

@Service
public class BrowserService {

    public String testScan(String url) {
        // Playwright.create() is the entry point
        try (Playwright playwright = Playwright.create()) {
            // Launch Chromium in "headless" mode (no visible window)
            Browser browser = playwright.chromium().launch(new BrowserType.LaunchOptions().setHeadless(true));
            Page page = browser.newPage();

            // Navigate to the user's URL
            page.navigate(url);

            // Get the title to prove it worked
            String title = page.title();

            browser.close();
            return "Successfully reached: " + title;
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }
}