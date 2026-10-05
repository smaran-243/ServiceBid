package com.servicebid.backend.service;

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