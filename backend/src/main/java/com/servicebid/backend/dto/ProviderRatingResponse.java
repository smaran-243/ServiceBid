package com.servicebid.backend.dto;

public record ProviderRatingResponse(Long providerId, Double averageRating, long reviewCount) {
}