package com.servicebid.backend.controller;

import com.servicebid.backend.dto.BidResponse;
import com.servicebid.backend.service.BidService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer/requests")
@CrossOrigin(origins = "http://localhost:5173")
public class CustomerBidController {

    private final BidService bidService;

    public CustomerBidController(BidService bidService) {
        this.bidService = bidService;
    }

    @GetMapping("/{requestId}/bids")
    public List<BidResponse> bidsForRequest(Authentication authentication,
                                            @PathVariable Long requestId) {
        return bidService.getBidsForMyRequest(authentication.getName(), requestId);
    }
}