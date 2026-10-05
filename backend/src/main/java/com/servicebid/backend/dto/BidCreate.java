package com.servicebid.backend.dto;

import java.math.BigDecimal;

public record BidCreate(BigDecimal amount, String message, String estimatedTime) {
}