package com.servicebid.backend.controller;

import com.servicebid.backend.dto.ServiceRequestResponse;
import com.servicebid.backend.service.ServiceRequestService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/provider/requests")
@CrossOrigin(origins = "http://localhost:5173")
public class ProviderRequestController {

    private final ServiceRequestService requestService;

    public ProviderRequestController(ServiceRequestService requestService) {
        this.requestService = requestService;
    }

    @GetMapping
    public List<ServiceRequestResponse> openRequests(Authentication auth) {
        return requestService.getOpenRequests(auth.getName());
    }

    @GetMapping("/{id}")
    public ServiceRequestResponse openRequest(@PathVariable Long id, Authentication auth) {
        return requestService.getOpenRequestById(auth.getName(), id);
    }
}