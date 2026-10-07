package com.servicebid.backend.dto;

public record ProviderProfileResponse(Long providerId, String providerName, String bio, String phone) {
}