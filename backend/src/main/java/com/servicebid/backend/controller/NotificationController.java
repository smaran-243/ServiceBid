package com.servicebid.backend.controller;

import com.servicebid.backend.dto.NotificationItem;
import com.servicebid.backend.service.NotificationService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public List<NotificationItem> mine(Authentication authentication) {
        return notificationService.getFor(authentication.getName());
    }
}