package com.platform.inventory.messaging;

import com.platform.inventory.entity.Inventory;
import com.platform.inventory.repository.InventoryRepository;
import com.platform.shared.events.OrderCreatedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Slf4j
public class OrderEventListener {

    private final InventoryRepository inventoryRepository;

    @RabbitListener(queues = "${rabbitmq.queue}")
    @Transactional
    public void handleOrderCreated(OrderCreatedEvent event) {
        log.info("Received order created event: {}", event.getOrderId());

        // Reserve inventory for each item in the order
        for (OrderCreatedEvent.OrderItem item : event.getItems()) {
            Inventory inventory = inventoryRepository.findByProductId(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found in inventory: " + item.getProductId()));

            try {
                inventory.reserve(item.getQuantity());
                inventoryRepository.save(inventory);
                log.info("Reserved {} units of product {}", item.getQuantity(), item.getProductId());
            } catch (RuntimeException e) {
                log.error("Failed to reserve inventory for product {}: {}", item.getProductId(), e.getMessage());
                throw e;
            }
        }
    }
}
