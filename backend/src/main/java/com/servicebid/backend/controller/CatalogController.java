package com.servicebid.backend.controller;

import com.servicebid.backend.dto.ServiceItemResponse;
import com.servicebid.backend.model.Category;
import com.servicebid.backend.service.CategoryService;
import com.servicebid.backend.service.ServiceItemService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class CatalogController {

    private final CategoryService categoryService;
    private final ServiceItemService serviceItemService;

    public CatalogController(CategoryService categoryService,
                             ServiceItemService serviceItemService) {
        this.categoryService = categoryService;
        this.serviceItemService = serviceItemService;
    }

    @GetMapping("/api/categories")
    public List<Category> getCategories() {
        return categoryService.getAll();
    }

    @GetMapping("/api/services")
    public List<ServiceItemResponse> getServices(@RequestParam(required = false) Long categoryId) {
        return serviceItemService.getAll(categoryId);
    }

    @GetMapping("/api/services/{id}")
    public ServiceItemResponse getService(@PathVariable Long id) {
        return serviceItemService.getById(id);
    }
}