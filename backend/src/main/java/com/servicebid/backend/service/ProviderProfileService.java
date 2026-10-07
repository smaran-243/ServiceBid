package com.servicebid.backend.service;

import com.servicebid.backend.dto.ProviderProfileRequest;
import com.servicebid.backend.dto.ProviderProfileResponse;
import com.servicebid.backend.model.ProviderProfile;
import com.servicebid.backend.model.Role;
import com.servicebid.backend.model.User;
import com.servicebid.backend.repository.ProviderProfileRepository;
import com.servicebid.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ProviderProfileService {

    private final ProviderProfileRepository profileRepository;
    private final UserRepository userRepository;

    public ProviderProfileService(ProviderProfileRepository profileRepository,
                                  UserRepository userRepository) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
    }

    // Logged-in provider's own profile (empty bio/phone if not saved yet)
    public ProviderProfileResponse getMyProfile(String email) {
        User provider = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
        return build(provider);
    }

    // Create or update the logged-in provider's profile
    public ProviderProfileResponse saveMyProfile(String email, ProviderProfileRequest req) {
        User provider = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        if (req.bio() != null && req.bio().length() > 500) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Bio must be 500 characters or less");
        }

        ProviderProfile profile = profileRepository.findByUserId(provider.getId())
                .orElseGet(() -> {
                    ProviderProfile p = new ProviderProfile();
                    p.setUser(provider);
                    return p;
                });
        profile.setBio(req.bio());
        profile.setPhone(req.phone());
        profileRepository.save(profile);

        return build(provider);
    }

    // Any logged-in user can view a provider's public profile
    public ProviderProfileResponse getProviderProfile(Long providerId) {
        User provider = userRepository.findById(providerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Provider not found"));
        if (provider.getRole() != Role.PROVIDER) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Provider not found");
        }
        return build(provider);
    }

    private ProviderProfileResponse build(User provider) {
        ProviderProfile profile = profileRepository.findByUserId(provider.getId()).orElse(null);
        return new ProviderProfileResponse(
                provider.getId(),
                provider.getName(),
                profile == null ? "" : profile.getBio(),
                profile == null ? "" : profile.getPhone());
    }
}