package com.servicebid.backend.controller;

import com.servicebid.backend.dto.ProviderProfileRequest;
import com.servicebid.backend.dto.ProviderProfileResponse;
import com.servicebid.backend.service.ProviderProfileService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class ProviderProfileController {

    private final ProviderProfileService profileService;

    public ProviderProfileController(ProviderProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/api/provider/profile")
    public ProviderProfileResponse myProfile(Authentication authentication) {
        return profileService.getMyProfile(authentication.getName());
    }

    @PutMapping("/api/provider/profile")
    public ProviderProfileResponse saveProfile(@RequestBody ProviderProfileRequest req,
                                               Authentication authentication) {
        return profileService.saveMyProfile(authentication.getName(), req);
    }

    @GetMapping("/api/providers/{providerId}/profile")
    public ProviderProfileResponse providerProfile(@PathVariable Long providerId) {
        return profileService.getProviderProfile(providerId);
    }
}