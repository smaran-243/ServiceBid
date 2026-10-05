package com.servicebid.backend.repository;

import com.servicebid.backend.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    // A customer's bookings, newest first
    List<Booking> findByCustomerIdOrderByCreatedAtDesc(Long customerId);

    // A provider's bookings, newest first
    List<Booking> findByProviderIdOrderByCreatedAtDesc(Long providerId);
}