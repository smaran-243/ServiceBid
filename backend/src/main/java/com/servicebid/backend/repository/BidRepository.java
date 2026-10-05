package com.servicebid.backend.repository;

import com.servicebid.backend.model.Bid;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BidRepository extends JpaRepository<Bid, Long> {

    // Duplicate-bid check: has this provider already bid on this request?
    boolean existsByRequestIdAndProviderId(Long requestId, Long providerId);

    // All bids on one request (customer compares these), cheapest first
    List<Bid> findByRequestIdOrderByAmountAsc(Long requestId);

    // A provider's own bids, newest first
    List<Bid> findByProviderIdOrderByCreatedAtDesc(Long providerId);
}