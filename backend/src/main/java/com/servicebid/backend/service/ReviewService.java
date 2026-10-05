package com.servicebid.backend.service;

import com.servicebid.backend.dto.ProviderRatingResponse;
import com.servicebid.backend.dto.ReviewCreate;
import com.servicebid.backend.dto.ReviewResponse;
import com.servicebid.backend.model.Booking;
import com.servicebid.backend.model.BookingStatus;
import com.servicebid.backend.model.Review;
import com.servicebid.backend.model.User;
import com.servicebid.backend.repository.BookingRepository;
import com.servicebid.backend.repository.ReviewRepository;
import com.servicebid.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    public ReviewService(ReviewRepository reviewRepository,
                         BookingRepository bookingRepository,
                         UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
    }

    // Customer reviews the provider of a COMPLETED booking (one review per booking)
    public ReviewResponse createReview(String customerEmail, Long bookingId, ReviewCreate body) {
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));

        // Only the customer of this booking (others get "not found")
        if (!booking.getCustomer().getId().equals(customer.getId())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found");
        }
        if (body.rating() < 1 || body.rating() > 5) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Rating must be between 1 and 5");
        }
        if (booking.getStatus() != BookingStatus.COMPLETED) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Booking is not completed yet");
        }
        if (reviewRepository.existsByBookingId(bookingId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Booking already reviewed");
        }

        Review review = new Review();
        review.setBooking(booking);
        review.setCustomer(customer);
        review.setProvider(booking.getProvider());
        review.setRating(body.rating());
        review.setComment(body.comment());

        return toResponse(reviewRepository.save(review));
    }

    // All reviews of one provider, newest first
    public List<ReviewResponse> getReviewsForProvider(Long providerId) {
        return reviewRepository.findByProviderIdOrderByCreatedAtDesc(providerId)
                .stream().map(this::toResponse).toList();
    }
    // Average rating and number of reviews of one provider
    public ProviderRatingResponse getProviderRating(Long providerId) {
        Double avg = reviewRepository.findAverageRatingByProviderId(providerId);
        long count = reviewRepository.findByProviderIdOrderByCreatedAtDesc(providerId).size();
        return new ProviderRatingResponse(providerId, avg, count);
    }
    private ReviewResponse toResponse(Review r) {
        return new ReviewResponse(
                r.getId(),
                r.getBooking().getId(),
                r.getCustomer().getId(),
                r.getCustomer().getName(),
                r.getProvider().getId(),
                r.getProvider().getName(),
                r.getRating(),
                r.getComment(),
                r.getCreatedAt());
    }
}