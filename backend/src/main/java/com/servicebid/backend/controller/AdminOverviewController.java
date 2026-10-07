package com.servicebid.backend.controller;

import com.servicebid.backend.dto.AdminUserResponse;
import com.servicebid.backend.dto.BookingResponse;
import com.servicebid.backend.repository.UserRepository;
import com.servicebid.backend.service.BookingService;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;
import com.servicebid.backend.dto.ServiceRequestResponse;
import com.servicebid.backend.service.ServiceRequestService;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class AdminOverviewController {

    private final UserRepository userRepository;
    private final BookingService bookingService;
    private final ServiceRequestService requestService;

    public AdminOverviewController(UserRepository userRepository, BookingService bookingService,
                                   ServiceRequestService requestService) {
        this.userRepository = userRepository;
        this.bookingService = bookingService;
        this.requestService = requestService;
    }

    @GetMapping("/api/admin/users")
    public List<AdminUserResponse> users() {
        return userRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt")).stream()
                .map(u -> new AdminUserResponse(u.getId(), u.getName(), u.getEmail(), u.getRole(), u.getCreatedAt()))
                .toList();
    }

    @GetMapping("/api/admin/bookings")
    public List<BookingResponse> bookings() {
        return bookingService.getAllBookings();
    }
    @GetMapping("/api/admin/requests")
    public List<ServiceRequestResponse> requests() {
        return requestService.getAllRequests();
    }
}