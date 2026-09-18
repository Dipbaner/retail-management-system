package com.novatech.retail_system_backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import jakarta.persistence.CascadeType;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter @Setter
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long customerId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal subTotal;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal discount;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal totalAmount;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @OneToMany(
            mappedBy = "order",
            cascade = jakarta.persistence.CascadeType.ALL,
            orphanRemoval = true
    )
    private List<OrderItem> items = new ArrayList<>();

    public Order() {

    }

    public Order (
            Long customerId, OrderStatus status,
            BigDecimal subTotal, BigDecimal discount,
            BigDecimal totalAmount, LocalDateTime createdAt
    ) {
        this.subTotal = subTotal;
        this.discount = discount;
        this.customerId = customerId;
        this.status = status;
        this.totalAmount = totalAmount;
        this.createdAt = createdAt;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subTotal = subtotal;
    }
}
