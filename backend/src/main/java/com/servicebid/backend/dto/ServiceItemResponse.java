package com.servicebid.backend.dto;

public record ServiceItemResponse(Long id, String name, String description,
                                  Long categoryId, String categoryName) {
}