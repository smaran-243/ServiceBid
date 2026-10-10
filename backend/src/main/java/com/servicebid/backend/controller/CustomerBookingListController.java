package com.servicebid.backend.controller;

import com.servicebid.backend.dto.BookingResponse;
import com.servicebid.backend.service.BookingService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer/bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class CustomerBookingListController {

    private final BookingService bookingService;

    public CustomerBookingListController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping
    public List<BookingResponse> myBookings(Authentication authentication) {
        return bookingService.getMyBookingsAsCustomer(authentication.getName());
    }

    @PostMapping("/{bookingId}/cancel")
    public BookingResponse cancel(@PathVariable Long bookingId, Authentication authentication) {
        return bookingService.cancelAsCustomer(authentication.getName(), bookingId);
    }

    @PostMapping("/{bookingId}/complete")
    public BookingResponse complete(@PathVariable Long bookingId, Authentication authentication) {
        return bookingService.completeAsCustomer(authentication.getName(), bookingId);
    }
}