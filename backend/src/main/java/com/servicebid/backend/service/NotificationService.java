package com.servicebid.backend.service;

import com.servicebid.backend.dto.NotificationItem;
import com.servicebid.backend.model.Booking;
import com.servicebid.backend.model.BookingStatus;
import com.servicebid.backend.model.Bid;
import com.servicebid.backend.model.BidStatus;
import com.servicebid.backend.model.RequestStatus;
import com.servicebid.backend.model.Role;
import com.servicebid.backend.model.ServiceRequest;
import com.servicebid.backend.model.User;
import com.servicebid.backend.repository.BidRepository;
import com.servicebid.backend.repository.BookingRepository;
import com.servicebid.backend.repository.ProviderOfferingRepository;
import com.servicebid.backend.repository.ServiceRequestRepository;
import com.servicebid.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;

@Service
public class NotificationService {

    private final UserRepository userRepository;
    private final ServiceRequestRepository requestRepository;
    private final BidRepository bidRepository;
    private final BookingRepository bookingRepository;
    private final ProviderOfferingRepository offeringRepository;

    public NotificationService(UserRepository userRepository,
                               ServiceRequestRepository requestRepository,
                               BidRepository bidRepository,
                               BookingRepository bookingRepository,
                               ProviderOfferingRepository offeringRepository) {
        this.userRepository = userRepository;
        this.requestRepository = requestRepository;
        this.bidRepository = bidRepository;
        this.bookingRepository = bookingRepository;
        this.offeringRepository = offeringRepository;
    }

    public List<NotificationItem> getFor(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
        List<NotificationItem> items = new ArrayList<>();

        if (user.getRole() == Role.CUSTOMER) {
            for (ServiceRequest r : requestRepository.findByCustomerIdOrderByCreatedAtDesc(user.getId())) {
                if (r.getStatus() != RequestStatus.OPEN) continue;
                long pending = bidRepository.findByRequestIdOrderByAmountAsc(r.getId())
                        .stream().filter(b -> b.getStatus() == BidStatus.PENDING).count();
                if (pending > 0) {
                    items.add(new NotificationItem(
                            pending + (pending == 1 ? " bid" : " bids") + " waiting on your "
                                    + r.getService().getName() + " request",
                            "/customer/requests/" + r.getId()));
                }
            }
            for (Booking b : bookingRepository.findByCustomerIdOrderByCreatedAtDesc(user.getId())) {
                if (b.getStatus() == BookingStatus.IN_PROGRESS) {
                    items.add(new NotificationItem(
                            b.getRequest().getService().getName() + " is in progress. Confirm when the job is done",
                            "/customer/bookings"));
                }
            }
        } else if (user.getRole() == Role.PROVIDER) {
            for (Booking b : bookingRepository.findByProviderIdOrderByCreatedAtDesc(user.getId())) {
                if (b.getStatus() == BookingStatus.BID_ACCEPTED) {
                    items.add(new NotificationItem(
                            "Your bid was accepted for " + b.getRequest().getService().getName() + ". Confirm the booking",
                            "/provider/bookings"));
                }
            }
            List<Long> serviceIds = offeringRepository.findByProviderId(user.getId())
                    .stream().map(o -> o.getService().getId()).toList();
            if (!serviceIds.isEmpty()) {
                LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);
                for (ServiceRequest r : requestRepository
                        .findByStatusAndServiceIdInOrderByCreatedAtDesc(RequestStatus.OPEN, serviceIds)) {
                    if (r.getBidDeadline() != null && r.getBidDeadline().isBefore(now)) continue;
                    if (bidRepository.existsByRequestIdAndProviderId(r.getId(), user.getId())) continue;
                    items.add(new NotificationItem(
                            "New request: " + r.getService().getName() + " in " + r.getLocation(),
                            "/provider/requests/" + r.getId()));
                }
            }
        }
        return items;
    }
}