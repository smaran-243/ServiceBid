package com.servicebid.backend.dto;

import com.servicebid.backend.model.BookingStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record BookingResponse(Long id, Long requestId, Long bidId, String serviceName,
                              Long customerId, String customerName,
                              Long providerId, String providerName,
                              BigDecimal agreedAmount, BookingStatus status,
                              LocalDateTime createdAt, boolean reviewed) {
}