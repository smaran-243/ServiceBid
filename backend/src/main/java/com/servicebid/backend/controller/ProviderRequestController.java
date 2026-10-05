package com.servicebid.backend.controller;

import com.servicebid.backend.dto.ServiceRequestResponse;
import com.servicebid.backend.service.ServiceRequestService;
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
    public List<ServiceRequestResponse> openRequests() {
        return requestService.getOpenRequests();
    }

    @GetMapping("/{id}")
    public ServiceRequestResponse openRequest(@PathVariable Long id) {
        return requestService.getOpenRequestById(id);
    }
}