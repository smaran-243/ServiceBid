package com.servicebid.backend.repository;

import com.servicebid.backend.model.ProviderOffering;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProviderOfferingRepository extends JpaRepository<ProviderOffering, Long> {
    List<ProviderOffering> findByProviderId(Long providerId);
    void deleteByProviderId(Long providerId);
    boolean existsByProviderIdAndServiceId(Long providerId, Long serviceId);
}