package com.servicebid.backend.controller;

import com.servicebid.backend.dto.BidCreate;
import com.servicebid.backend.dto.BidResponse;
import com.servicebid.backend.service.BidService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/provider")
@CrossOrigin(origins = "http://localhost:5173")
public class ProviderBidController {

    private final BidService bidService;

    public ProviderBidController(BidService bidService) {
        this.bidService = bidService;
    }

    @PostMapping("/requests/{requestId}/bids")
    @ResponseStatus(HttpStatus.CREATED)
    public BidResponse submitBid(Authentication authentication,
                                 @PathVariable Long requestId,
                                 @RequestBody BidCreate body) {
        return bidService.submitBid(authentication.getName(), requestId, body);
    }

    @GetMapping("/bids")
    public List<BidResponse> myBids(Authentication authentication) {
        return bidService.getMyBids(authentication.getName());
    }
}