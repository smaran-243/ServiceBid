package com.servicebid.backend.service;

import com.servicebid.backend.dto.ServiceItemResponse;
import com.servicebid.backend.model.ProviderOffering;
import com.servicebid.backend.model.Role;
import com.servicebid.backend.model.ServiceItem;
import com.servicebid.backend.model.User;
import com.servicebid.backend.repository.ProviderOfferingRepository;
import com.servicebid.backend.repository.ServiceItemRepository;
import com.servicebid.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ProviderOfferingService {

    private final ProviderOfferingRepository offeringRepository;
    private final ServiceItemRepository serviceItemRepository;
    private final UserRepository userRepository;

    public ProviderOfferingService(ProviderOfferingRepository offeringRepository,
                                   ServiceItemRepository serviceItemRepository,
                                   UserRepository userRepository) {
        this.offeringRepository = offeringRepository;
        this.serviceItemRepository = serviceItemRepository;
        this.userRepository = userRepository;
    }

    public List<ServiceItemResponse> getMyServices(String email) {
        User provider = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
        return list(provider.getId());
    }

    // Replace the provider's whole list of services
    @Transactional
    public List<ServiceItemResponse> setMyServices(String email, List<Long> serviceIds) {
        User provider = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
        if (serviceIds == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "serviceIds is required");
        }

        List<ServiceItem> chosen = serviceIds.stream().distinct()
                .map(id -> serviceItemRepository.findById(id)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Service not found: " + id)))
                .toList();

        offeringRepository.deleteByProviderId(provider.getId());
        offeringRepository.flush();

        for (ServiceItem s : chosen) {
            ProviderOffering o = new ProviderOffering();
            o.setProvider(provider);
            o.setService(s);
            offeringRepository.save(o);
        }
        return list(provider.getId());
    }

    // Public view of any provider's services
    public List<ServiceItemResponse> getProviderServices(Long providerId) {
        User provider = userRepository.findById(providerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Provider not found"));
        if (provider.getRole() != Role.PROVIDER) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Provider not found");
        }
        return list(providerId);
    }

    private List<ServiceItemResponse> list(Long providerId) {
        return offeringRepository.findByProviderId(providerId).stream()
                .map(o -> o.getService())
                .map(s -> new ServiceItemResponse(
                        s.getId(), s.getName(), s.getDescription(),
                        s.getCategory().getId(), s.getCategory().getName()))
                .toList();
    }
}