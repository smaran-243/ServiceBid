package com.servicebid.backend.repository;

import com.servicebid.backend.model.ServiceItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ServiceItemRepository extends JpaRepository<ServiceItem, Long> {

    boolean existsByName(String name);

    List<ServiceItem> findByCategoryId(Long categoryId);
}