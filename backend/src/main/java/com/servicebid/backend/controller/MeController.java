package com.servicebid.backend.controller;

import com.servicebid.backend.model.User;
import com.servicebid.backend.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class MeController {

    private final UserRepository userRepository;

    public MeController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/api/me")
    public Map<String, Object> me(Authentication authentication) {
        String email = authentication.getName();
        String name = userRepository.findByEmail(email)
                .map(User::getName)
                .filter(n -> !n.isBlank())
                .orElse(email);
        return Map.of(
                "email", email,
                "name", name,
                "roles", authentication.getAuthorities().toString()
        );
    }
}