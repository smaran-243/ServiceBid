package com.servicebid.backend.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(optional = false)
    @JoinColumn(name = "request_id", unique = true)
    private ServiceRequest request;

    @OneToOne(optional = false)
    @JoinColumn(name = "bid_id", unique = true)
    private Bid bid;

    @ManyToOne(optional = false)
    @JoinColumn(name = "customer_id")
    private User customer;

    @ManyToOne(optional = false)
    @JoinColumn(name = "provider_id")
    private User provider;

    @Column(nullable = false)
    private BigDecimal agreedAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status = BookingStatus.BID_ACCEPTED;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Booking() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ServiceRequest getRequest() { return request; }
    public void setRequest(ServiceRequest request) { this.request = request; }

    public Bid getBid() { return bid; }
    public void setBid(Bid bid) { this.bid = bid; }

    public User getCustomer() { return customer; }
    public void setCustomer(User customer) { this.customer = customer; }

    public User getProvider() { return provider; }
    public void setProvider(User provider) { this.provider = provider; }

    public BigDecimal getAgreedAmount() { return agreedAmount; }
    public void setAgreedAmount(BigDecimal agreedAmount) { this.agreedAmount = agreedAmount; }

    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}