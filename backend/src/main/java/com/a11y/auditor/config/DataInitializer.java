package com.a11y.auditor.config;

import com.a11y.auditor.model.AppUser;
import com.a11y.auditor.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class DataInitializer {

//    @Bean
//    public PasswordEncoder passwordEncoder() {
//        return new BCryptPasswordEncoder();
//    }

    @Bean
    CommandLineRunner init(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.findByUsername("admin").isEmpty()) {
                AppUser user = new AppUser();
                user.setUsername("admin");
                // "password" encrypted
                user.setPassword(passwordEncoder.encode("password"));
                userRepository.save(user);
                System.out.println("TEST USER CREATED: admin / password");
            }
        };
    }
}