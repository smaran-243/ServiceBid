package com.servicebid.backend.dto;

import com.servicebid.backend.model.Role;
import java.time.LocalDateTime;

public record AdminUserResponse(Long id, String name, String email, Role role, LocalDateTime createdAt) {
}