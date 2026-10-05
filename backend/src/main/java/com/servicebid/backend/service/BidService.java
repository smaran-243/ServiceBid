package com.servicebid.backend.service;

import com.servicebid.backend.dto.BidCreate;
import com.servicebid.backend.dto.BidResponse;
import com.servicebid.backend.model.Bid;
import com.servicebid.backend.model.RequestStatus;
import com.servicebid.backend.model.ServiceRequest;
import com.servicebid.backend.model.User;
import com.servicebid.backend.repository.BidRepository;
import com.servicebid.backend.repository.ServiceRequestRepository;
import com.servicebid.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;

@Service
public class BidService {

    private final BidRepository bidRepository;
    private final ServiceRequestRepository requestRepository;
    private final UserRepository userRepository;

    public BidService(BidRepository bidRepository,
                      ServiceRequestRepository requestRepository,
                      UserRepository userRepository) {
        this.bidRepository = bidRepository;
        this.requestRepository = requestRepository;
        this.userRepository = userRepository;
    }

    // Provider submits a bid on a request
    public BidResponse submitBid(String providerEmail, Long requestId, BidCreate body) {
        if (body.amount() == null || body.amount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Amount must be more than 0");
        }

        User provider = findUser(providerEmail);

        ServiceRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Request not found"));

        if (request.getStatus() != RequestStatus.OPEN) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Request is not open for bids");
        }

        if (bidRepository.existsByRequestIdAndProviderId(requestId, provider.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "You already bid on this request");
        }

        Bid bid = new Bid();
        bid.setRequest(request);
        bid.setProvider(provider);
        bid.setAmount(body.amount());
        bid.setMessage(body.message() == null ? null : body.message().trim());
        bid.setEstimatedTime(body.estimatedTime() == null ? null : body.estimatedTime().trim());

        return toResponse(bidRepository.save(bid));
    }

    // Provider lists their own bids
    public List<BidResponse> getMyBids(String providerEmail) {
        User provider = findUser(providerEmail);
        return bidRepository.findByProviderIdOrderByCreatedAtDesc(provider.getId())
                .stream().map(this::toResponse).toList();
    }
    // Customer lists all bids on one of their own requests, cheapest first
    public List<BidResponse> getBidsForMyRequest(String customerEmail, Long requestId) {
        User customer = findUser(customerEmail);
        ServiceRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Request not found"));
        if (!request.getCustomer().getId().equals(customer.getId())) {
            // Hide other people's requests: same answer as "not found"
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Request not found");
        }
        return bidRepository.findByRequestIdOrderByAmountAsc(requestId)
                .stream().map(this::toResponse).toList();
    }
    private User findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
    }

    private BidResponse toResponse(Bid b) {
        return new BidResponse(
                b.getId(),
                b.getRequest().getId(),
                b.getRequest().getService().getName(),
                b.getProvider().getId(),
                b.getProvider().getName(),
                b.getAmount(),
                b.getMessage(),
                b.getEstimatedTime(),
                b.getStatus(),
                b.getCreatedAt());
    }
}