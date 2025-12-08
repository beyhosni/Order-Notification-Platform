package com.platform.inventory.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "inventory")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false, unique = true)
    private String productId;

    @Column(nullable = false)
    private Integer quantity = 0;

    @Column(nullable = false)
    private Integer reserved = 0;

    public Integer getAvailable() {
        return quantity - reserved;
    }

    public boolean canReserve(Integer amount) {
        return getAvailable() >= amount;
    }

    public void reserve(Integer amount) {
        if (!canReserve(amount)) {
            throw new RuntimeException("Insufficient inventory");
        }
        this.reserved += amount;
    }

    public void release(Integer amount) {
        this.reserved -= amount;
        if (this.reserved < 0) {
            this.reserved = 0;
        }
    }

    public void decreaseQuantity(Integer amount) {
        this.quantity -= amount;
        this.reserved -= amount;
        if (this.quantity < 0) {
            this.quantity = 0;
        }
        if (this.reserved < 0) {
            this.reserved = 0;
        }
    }
}
