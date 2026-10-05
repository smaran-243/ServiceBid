package com.servicebid.backend.controller;

import com.servicebid.backend.dto.CategoryRequest;
import com.servicebid.backend.dto.ServiceItemRequest;
import com.servicebid.backend.dto.ServiceItemResponse;
import com.servicebid.backend.model.Category;
import com.servicebid.backend.service.CategoryService;
import com.servicebid.backend.service.ServiceItemService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminCatalogController {

    private final CategoryService categoryService;
    private final ServiceItemService serviceItemService;

    public AdminCatalogController(CategoryService categoryService,
                                  ServiceItemService serviceItemService) {
        this.categoryService = categoryService;
        this.serviceItemService = serviceItemService;
    }

    @PostMapping("/categories")
    @ResponseStatus(HttpStatus.CREATED)
    public Category createCategory(@RequestBody CategoryRequest request) {
        return categoryService.create(request);
    }

    @PutMapping("/categories/{id}")
    public Category updateCategory(@PathVariable Long id, @RequestBody CategoryRequest request) {
        return categoryService.update(id, request);
    }

    @DeleteMapping("/categories/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCategory(@PathVariable Long id) {
        categoryService.delete(id);
    }

    @PostMapping("/services")
    @ResponseStatus(HttpStatus.CREATED)
    public ServiceItemResponse createService(@RequestBody ServiceItemRequest request) {
        return serviceItemService.create(request);
    }

    @PutMapping("/services/{id}")
    public ServiceItemResponse updateService(@PathVariable Long id, @RequestBody ServiceItemRequest request) {
        return serviceItemService.update(id, request);
    }

    @DeleteMapping("/services/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteService(@PathVariable Long id) {
        serviceItemService.delete(id);
    }
}