package com.servicebid.backend.service;

import com.servicebid.backend.dto.ServiceItemRequest;
import com.servicebid.backend.dto.ServiceItemResponse;
import com.servicebid.backend.model.Category;
import com.servicebid.backend.model.ServiceItem;
import com.servicebid.backend.repository.CategoryRepository;
import com.servicebid.backend.repository.ServiceItemRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ServiceItemService {

    private final ServiceItemRepository serviceItemRepository;
    private final CategoryRepository categoryRepository;

    public ServiceItemService(ServiceItemRepository serviceItemRepository,
                              CategoryRepository categoryRepository) {
        this.serviceItemRepository = serviceItemRepository;
        this.categoryRepository = categoryRepository;
    }

    // categoryId is optional: null returns all services
    public List<ServiceItemResponse> getAll(Long categoryId) {
        List<ServiceItem> items = (categoryId == null)
                ? serviceItemRepository.findAll()
                : serviceItemRepository.findByCategoryId(categoryId);
        return items.stream().map(this::toResponse).toList();
    }

    public ServiceItemResponse getById(Long id) {
        return toResponse(findOrThrow(id));
    }

    public ServiceItemResponse create(ServiceItemRequest request) {
        String name = cleanName(request.name());
        if (serviceItemRepository.existsByName(name)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Service already exists");
        }
        ServiceItem item = new ServiceItem(name, request.description(), findCategory(request.categoryId()));
        return toResponse(serviceItemRepository.save(item));
    }

    public ServiceItemResponse update(Long id, ServiceItemRequest request) {
        ServiceItem item = findOrThrow(id);
        String name = cleanName(request.name());
        if (!item.getName().equals(name) && serviceItemRepository.existsByName(name)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Service already exists");
        }
        item.setName(name);
        item.setDescription(request.description());
        item.setCategory(findCategory(request.categoryId()));
        return toResponse(serviceItemRepository.save(item));
    }

    public void delete(Long id) {
        findOrThrow(id);
        serviceItemRepository.deleteById(id);
    }

    private ServiceItem findOrThrow(Long id) {
        return serviceItemRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found"));
    }

    private Category findCategory(Long categoryId) {
        if (categoryId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category is required");
        }
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category does not exist"));
    }

    private String cleanName(String name) {
        if (name == null || name.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Name is required");
        }
        return name.trim();
    }

    private ServiceItemResponse toResponse(ServiceItem item) {
        Category c = item.getCategory();
        return new ServiceItemResponse(
                item.getId(),
                item.getName(),
                item.getDescription(),
                c == null ? null : c.getId(),
                c == null ? null : c.getName());
    }
}