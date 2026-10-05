package com.servicebid.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ServiceRequestCreate(Long serviceId, String description, BigDecimal budget,
                                   LocalDateTime scheduledAt, String location) {
}