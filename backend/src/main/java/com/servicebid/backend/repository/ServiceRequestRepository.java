package com.servicebid.backend.repository;

import java.util.Collection;
import com.servicebid.backend.model.RequestStatus;
import com.servicebid.backend.model.ServiceRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {

    // A customer's own requests, newest first
    List<ServiceRequest> findByCustomerIdOrderByCreatedAtDesc(Long customerId);

    // All requests with a given status (providers will see the OPEN ones), newest first
    List<ServiceRequest> findByStatusOrderByCreatedAtDesc(RequestStatus status);
    List<ServiceRequest> findByStatusAndServiceIdInOrderByCreatedAtDesc(RequestStatus status, Collection<Long> serviceIds);
}