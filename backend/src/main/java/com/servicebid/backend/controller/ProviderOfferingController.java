package com.servicebid.backend.controller;

import com.servicebid.backend.dto.ProviderServicesRequest;
import com.servicebid.backend.dto.ServiceItemResponse;
import com.servicebid.backend.service.ProviderOfferingService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class ProviderOfferingController {

    private final ProviderOfferingService offeringService;

    public ProviderOfferingController(ProviderOfferingService offeringService) {
        this.offeringService = offeringService;
    }

    @GetMapping("/api/provider/services")
    public List<ServiceItemResponse> myServices(Authentication authentication) {
        return offeringService.getMyServices(authentication.getName());
    }

    @PutMapping("/api/provider/services")
    public List<ServiceItemResponse> saveServices(@RequestBody ProviderServicesRequest req,
                                                  Authentication authentication) {
        return offeringService.setMyServices(authentication.getName(), req.serviceIds());
    }

    @GetMapping("/api/providers/{providerId}/services")
    public List<ServiceItemResponse> providerServices(@PathVariable Long providerId) {
        return offeringService.getProviderServices(providerId);
    }
}