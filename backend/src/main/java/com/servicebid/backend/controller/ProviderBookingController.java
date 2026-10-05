package com.servicebid.backend.controller;

import com.servicebid.backend.dto.BookingStatusUpdate;
import com.servicebid.backend.dto.BookingResponse;
import com.servicebid.backend.service.BookingService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/provider/bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class ProviderBookingController {

    private final BookingService bookingService;

    public ProviderBookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping
    public List<BookingResponse> myBookings(Authentication authentication) {
        return bookingService.getMyBookingsAsProvider(authentication.getName());
    }
    @PatchMapping("/{bookingId}/status")
    public BookingResponse updateStatus(Authentication authentication,
                                        @PathVariable Long bookingId,
                                        @RequestBody BookingStatusUpdate body) {
        return bookingService.updateStatus(authentication.getName(), bookingId, body.status());
    }
}