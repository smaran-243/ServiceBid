package com.servicebid.backend.service;

import com.servicebid.backend.model.RequestStatus;
import com.servicebid.backend.dto.ServiceRequestCreate;
import com.servicebid.backend.dto.ServiceRequestResponse;
import com.servicebid.backend.model.ServiceItem;
import com.servicebid.backend.model.ServiceRequest;
import com.servicebid.backend.model.User;
import com.servicebid.backend.repository.ServiceItemRepository;
import com.servicebid.backend.repository.ServiceRequestRepository;
import com.servicebid.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ServiceRequestService {

    private final ServiceRequestRepository requestRepository;
    private final ServiceItemRepository serviceItemRepository;
    private final UserRepository userRepository;

    public ServiceRequestService(ServiceRequestRepository requestRepository,
                                 ServiceItemRepository serviceItemRepository,
                                 UserRepository userRepository) {
        this.requestRepository = requestRepository;
        this.serviceItemRepository = serviceItemRepository;
        this.userRepository = userRepository;
    }

    // Customer creates a request
    public ServiceRequestResponse create(String customerEmail, ServiceRequestCreate req) {
        if (req.serviceId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Service is required");
        }
        if (req.description() == null || req.description().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Description is required");
        }
        if (req.location() == null || req.location().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Location is required");
        }
        if (req.budget() != null && req.budget().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Budget must be more than 0");
        }

        ServiceItem service = serviceItemRepository.findById(req.serviceId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Service does not exist"));

        ServiceRequest request = new ServiceRequest();
        request.setService(service);
        request.setCustomer(findUser(customerEmail));
        request.setDescription(req.description().trim());
        request.setBudget(req.budget());
        request.setScheduledAt(req.scheduledAt());
        request.setLocation(req.location().trim());

        return toResponse(requestRepository.save(request));
    }

    // Customer lists their own requests
    public List<ServiceRequestResponse> getMyRequests(String customerEmail) {
        User customer = findUser(customerEmail);
        return requestRepository.findByCustomerIdOrderByCreatedAtDesc(customer.getId())
                .stream().map(this::toResponse).toList();
    }

    // Customer views one of their own requests
    public ServiceRequestResponse getMyRequestById(String customerEmail, Long id) {
        User customer = findUser(customerEmail);
        ServiceRequest request = requestRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Request not found"));
        if (!request.getCustomer().getId().equals(customer.getId())) {
            // Hide other people's requests: same answer as "not found"
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Request not found");
        }
        return toResponse(request);
    }
    // Provider lists all OPEN requests
    public List<ServiceRequestResponse> getOpenRequests() {
        return requestRepository.findByStatusOrderByCreatedAtDesc(RequestStatus.OPEN)
                .stream().map(this::toResponse).toList();
    }

    // Provider views one OPEN request
    public ServiceRequestResponse getOpenRequestById(Long id) {
        ServiceRequest request = requestRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Request not found"));
        if (request.getStatus() != RequestStatus.OPEN) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Request not found");
        }
        return toResponse(request);
    }
    private User findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
    }

    private ServiceRequestResponse toResponse(ServiceRequest r) {
        return new ServiceRequestResponse(
                r.getId(),
                r.getService().getId(),
                r.getService().getName(),
                r.getCustomer().getName(),
                r.getDescription(),
                r.getBudget(),
                r.getScheduledAt(),
                r.getLocation(),
                r.getStatus(),
                r.getCreatedAt());
    }
}