package com.servicebid.backend.controller;

import com.servicebid.backend.dto.BookingResponse;
import com.servicebid.backend.service.BookingService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customer/bids")
@CrossOrigin(origins = "http://localhost:5173")
public class CustomerBookingController {

    private final BookingService bookingService;

    public CustomerBookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping("/{bidId}/accept")
    @ResponseStatus(HttpStatus.CREATED)
    public BookingResponse acceptBid(Authentication authentication,
                                     @PathVariable Long bidId) {
        return bookingService.acceptBid(authentication.getName(), bidId);
    }
}