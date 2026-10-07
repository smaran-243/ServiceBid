package com.servicebid.backend.dto;

import java.util.List;

public record ProviderServicesRequest(List<Long> serviceIds) {
}