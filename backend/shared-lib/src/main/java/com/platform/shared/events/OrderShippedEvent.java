package com.platform.shared.events;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderShippedEvent implements Serializable {
    private String orderId;
    private String trackingNumber;
    private String carrier;
    private LocalDateTime shippedAt;
}
