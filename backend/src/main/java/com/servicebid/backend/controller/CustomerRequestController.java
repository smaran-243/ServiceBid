package com.servicebid.backend.controller;

import com.servicebid.backend.dto.ServiceRequestCreate;
import com.servicebid.backend.dto.ServiceRequestResponse;
import com.servicebid.backend.service.ServiceRequestService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer/requests")
@CrossOrigin(origins = "http://localhost:5173")
public class CustomerRequestController {

    private final ServiceRequestService requestService;

    public CustomerRequestController(ServiceRequestService requestService) {
        this.requestService = requestService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ServiceRequestResponse create(Authentication authentication,
                                         @RequestBody ServiceRequestCreate body) {
        return requestService.create(authentication.getName(), body);
    }

    @GetMapping
    public List<ServiceRequestResponse> myRequests(Authentication authentication) {
        return requestService.getMyRequests(authentication.getName());
    }

    @GetMapping("/{id}")
    public ServiceRequestResponse myRequest(Authentication authentication, @PathVariable Long id) {
        return requestService.getMyRequestById(authentication.getName(), id);
    }
}