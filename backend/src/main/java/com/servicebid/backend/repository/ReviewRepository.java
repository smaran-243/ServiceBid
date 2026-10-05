package com.servicebid.backend.repository;

import com.servicebid.backend.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    boolean existsByBookingId(Long bookingId);

    // A provider's reviews, newest first
    List<Review> findByProviderIdOrderByCreatedAtDesc(Long providerId);

    // Average rating of a provider (null if no reviews)
    @Query("select avg(r.rating) from Review r where r.provider.id = :providerId")
    Double findAverageRatingByProviderId(@org.springframework.data.repository.query.Param("providerId") Long providerId);
}