package com.servicebid.backend.dto;

import com.servicebid.backend.model.BidStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record BidResponse(Long id, Long requestId, String serviceName,
                          Long providerId, String providerName,
                          BigDecimal amount, String message, String estimatedTime,
                          BidStatus status, LocalDateTime createdAt) {
}