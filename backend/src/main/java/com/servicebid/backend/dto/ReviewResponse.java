package com.servicebid.backend.dto;

import java.time.LocalDateTime;

public record ReviewResponse(Long id, Long bookingId, Long customerId, String customerName,
                             Long providerId, String providerName,
                             int rating, String comment, LocalDateTime createdAt) {
}