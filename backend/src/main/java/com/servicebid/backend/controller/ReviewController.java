package com.servicebid.backend.controller;

import com.servicebid.backend.dto.ProviderRatingResponse;
import com.servicebid.backend.dto.ReviewCreate;
import com.servicebid.backend.dto.ReviewResponse;
import com.servicebid.backend.service.ReviewService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    // Customer reviews a completed booking
    @PostMapping("/api/customer/bookings/{bookingId}/review")
    @ResponseStatus(HttpStatus.CREATED)
    public ReviewResponse createReview(Authentication authentication,
                                       @PathVariable Long bookingId,
                                       @RequestBody ReviewCreate body) {
        return reviewService.createReview(authentication.getName(), bookingId, body);
    }

    // Any logged-in user can see a provider's reviews
    @GetMapping("/api/providers/{providerId}/reviews")
    public List<ReviewResponse> providerReviews(@PathVariable Long providerId) {
        return reviewService.getReviewsForProvider(providerId);
    }

    @GetMapping("/api/providers/{providerId}/rating")
    public ProviderRatingResponse providerRating(@PathVariable Long providerId) {
        return reviewService.getProviderRating(providerId);
    }
}