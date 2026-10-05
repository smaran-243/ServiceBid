package com.servicebid.backend.dto;

public record ServiceItemRequest(String name, String description, Long categoryId) {
}