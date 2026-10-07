package com.servicebid.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "provider_offerings",
        uniqueConstraints = @UniqueConstraint(columnNames = {"provider_id", "service_id"}))
public class ProviderOffering {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "provider_id")
    private User provider;

    @ManyToOne(optional = false)
    @JoinColumn(name = "service_id")
    private ServiceItem service;

    public ProviderOffering() {
    }

    public Long getId() { return id; }
    public User getProvider() { return provider; }
    public void setProvider(User provider) { this.provider = provider; }
    public ServiceItem getService() { return service; }
    public void setService(ServiceItem service) { this.service = service; }
}