package com.servicebid.backend.service;

import com.servicebid.backend.model.BookingStatus;
import java.util.List;
import com.servicebid.backend.dto.BookingResponse;
import com.servicebid.backend.model.Bid;
import com.servicebid.backend.model.BidStatus;
import com.servicebid.backend.model.Booking;
import com.servicebid.backend.model.RequestStatus;
import com.servicebid.backend.model.ServiceRequest;
import com.servicebid.backend.model.User;
import com.servicebid.backend.repository.BidRepository;
import com.servicebid.backend.repository.BookingRepository;
import com.servicebid.backend.repository.ServiceRequestRepository;
import com.servicebid.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final BidRepository bidRepository;
    private final ServiceRequestRepository requestRepository;
    private final UserRepository userRepository;

    public BookingService(BookingRepository bookingRepository,
                          BidRepository bidRepository,
                          ServiceRequestRepository requestRepository,
                          UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.bidRepository = bidRepository;
        this.requestRepository = requestRepository;
        this.userRepository = userRepository;
    }

    // Customer accepts one bid: accept it, reject the others, close the request, create the booking
    @Transactional
    public BookingResponse acceptBid(String customerEmail, Long bidId) {
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        Bid bid = bidRepository.findById(bidId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Bid not found"));

        ServiceRequest request = bid.getRequest();

        // Only the owner of the request can accept (others get the same answer as "not found")
        if (!request.getCustomer().getId().equals(customer.getId())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Bid not found");
        }
        if (request.getStatus() != RequestStatus.OPEN) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Request is no longer open");
        }
        if (bid.getStatus() != BidStatus.PENDING) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Bid is not pending");
        }

        // 1. Accept this bid, reject the other pending bids on the same request
        for (Bid other : bidRepository.findByRequestIdOrderByAmountAsc(request.getId())) {
            if (other.getId().equals(bid.getId())) {
                other.setStatus(BidStatus.ACCEPTED);
            } else if (other.getStatus() == BidStatus.PENDING) {
                other.setStatus(BidStatus.REJECTED);
            }
            bidRepository.save(other);
        }

        // 2. Close the request
        request.setStatus(RequestStatus.ACCEPTED);
        requestRepository.save(request);

        // 3. Create the booking
        Booking booking = new Booking();
        booking.setRequest(request);
        booking.setBid(bid);
        booking.setCustomer(customer);
        booking.setProvider(bid.getProvider());
        booking.setAgreedAmount(bid.getAmount());

        return toResponse(bookingRepository.save(booking));
    }
    // Customer's own bookings, newest first
    public List<BookingResponse> getMyBookingsAsCustomer(String customerEmail) {
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
        return bookingRepository.findByCustomerIdOrderByCreatedAtDesc(customer.getId())
                .stream().map(this::toResponse).toList();
    }

    // Provider's own bookings, newest first
    public List<BookingResponse> getMyBookingsAsProvider(String providerEmail) {
        User provider = userRepository.findByEmail(providerEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
        return bookingRepository.findByProviderIdOrderByCreatedAtDesc(provider.getId())
                .stream().map(this::toResponse).toList();
    }
    // Provider moves their booking to the next status
    @Transactional
    public BookingResponse updateStatus(String providerEmail, Long bookingId, BookingStatus newStatus) {
        User provider = userRepository.findByEmail(providerEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));

        // Only the provider of this booking can change it (others get "not found")
        if (!booking.getProvider().getId().equals(provider.getId())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found");
        }
        if (newStatus == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Status is required");
        }
        if (!isAllowedMove(booking.getStatus(), newStatus)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Cannot move from " + booking.getStatus() + " to " + newStatus);
        }

        booking.setStatus(newStatus);

        // Keep the request status in step with the booking
        if (newStatus == BookingStatus.COMPLETED) {
            booking.getRequest().setStatus(RequestStatus.COMPLETED);
            requestRepository.save(booking.getRequest());
        } else if (newStatus == BookingStatus.CANCELLED) {
            booking.getRequest().setStatus(RequestStatus.CANCELLED);
            requestRepository.save(booking.getRequest());
        }

        return toResponse(bookingRepository.save(booking));
    }
    // Customer cancels their own booking (only while BID_ACCEPTED or CONFIRMED)
    @Transactional
    public BookingResponse cancelAsCustomer(String customerEmail, Long bookingId) {
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));

        // Only the booking's customer can cancel (others get "not found")
        if (!booking.getCustomer().getId().equals(customer.getId())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found");
        }
        if (booking.getStatus() != BookingStatus.BID_ACCEPTED
                && booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Cannot cancel a booking that is " + booking.getStatus());
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.getRequest().setStatus(RequestStatus.CANCELLED);
        requestRepository.save(booking.getRequest());

        return toResponse(bookingRepository.save(booking));
    }
    private boolean isAllowedMove(BookingStatus from, BookingStatus to) {
        return switch (from) {
            case BID_ACCEPTED -> to == BookingStatus.CONFIRMED || to == BookingStatus.CANCELLED;
            case CONFIRMED -> to == BookingStatus.IN_PROGRESS || to == BookingStatus.CANCELLED;
            case IN_PROGRESS -> to == BookingStatus.COMPLETED;
            default -> false;
        };
    }
    private BookingResponse toResponse(Booking b) {
        return new BookingResponse(
                b.getId(),
                b.getRequest().getId(),
                b.getBid().getId(),
                b.getRequest().getService().getName(),
                b.getCustomer().getId(),
                b.getCustomer().getName(),
                b.getProvider().getId(),
                b.getProvider().getName(),
                b.getAgreedAmount(),
                b.getStatus(),
                b.getCreatedAt());
    }
}