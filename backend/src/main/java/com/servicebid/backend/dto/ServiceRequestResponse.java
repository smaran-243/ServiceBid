package com.servicebid.backend.dto;

import com.servicebid.backend.model.RequestStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ServiceRequestResponse(Long id, Long serviceId, String serviceName,
                                     String customerName, String description,
                                     BigDecimal budget, LocalDateTime scheduledAt,
                                     String location, RequestStatus status,
                                     LocalDateTime createdAt) {
}