package com.platform.notification.messaging;

import com.platform.notification.service.NotificationService;
import com.platform.shared.events.OrderCreatedEvent;
import com.platform.shared.events.OrderPaidEvent;
import com.platform.shared.events.OrderShippedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class OrderEventListener {

    private final NotificationService notificationService;

    @RabbitListener(queues = "${rabbitmq.queues.order-created}")
    public void handleOrderCreated(OrderCreatedEvent event) {
        log.info("Received order created event: {}", event.getOrderId());
        notificationService.sendOrderCreatedNotification(
                event.getOrderId(),
                event.getUserId(),
                event.getTotalAmount().toString());
    }

    @RabbitListener(queues = "${rabbitmq.queues.order-paid}")
    public void handleOrderPaid(OrderPaidEvent event) {
        log.info("Received order paid event: {}", event.getOrderId());
        notificationService.sendOrderPaidNotification(
                event.getOrderId(),
                event.getPaymentId());
    }

    @RabbitListener(queues = "${rabbitmq.queues.order-shipped}")
    public void handleOrderShipped(OrderShippedEvent event) {
        log.info("Received order shipped event: {}", event.getOrderId());
        notificationService.sendOrderShippedNotification(
                event.getOrderId(),
                event.getTrackingNumber(),
                event.getCarrier());
    }
}
