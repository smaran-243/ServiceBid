package com.servicebid.backend.dto;

import com.servicebid.backend.model.Role;

public record RegisterRequest(String name, String email, String password, Role role) {}