package com.servicebid.backend.service;

import com.servicebid.backend.dto.CategoryRequest;
import com.servicebid.backend.model.Category;
import com.servicebid.backend.repository.CategoryRepository;
import com.servicebid.backend.repository.ServiceItemRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final ServiceItemRepository serviceItemRepository;

    public CategoryService(CategoryRepository categoryRepository,
                           ServiceItemRepository serviceItemRepository) {
        this.categoryRepository = categoryRepository;
        this.serviceItemRepository = serviceItemRepository;
    }

    public List<Category> getAll() {
        return categoryRepository.findAll();
    }

    public Category create(CategoryRequest request) {
        String name = cleanName(request.name());
        if (categoryRepository.existsByName(name)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Category already exists");
        }
        return categoryRepository.save(new Category(name));
    }

    public Category update(Long id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));
        String name = cleanName(request.name());
        if (!category.getName().equals(name) && categoryRepository.existsByName(name)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Category already exists");
        }
        category.setName(name);
        return categoryRepository.save(category);
    }

    public void delete(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found");
        }
        if (!serviceItemRepository.findByCategoryId(id).isEmpty()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Category still has services");
        }
        categoryRepository.deleteById(id);
    }

    private String cleanName(String name) {
        if (name == null || name.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Name is required");
        }
        return name.trim();
    }
}