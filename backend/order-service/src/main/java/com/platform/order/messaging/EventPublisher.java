package com.platform.order.messaging;

import com.platform.shared.events.OrderCreatedEvent;
import com.platform.shared.events.OrderPaidEvent;
import com.platform.shared.events.OrderShippedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class EventPublisher {

    private final RabbitTemplate rabbitTemplate;

    @Value("${rabbitmq.exchange}")
    private String exchange;

    public void publishOrderCreated(OrderCreatedEvent event) {
        log.info("Publishing order created event: {}", event.getOrderId());
        rabbitTemplate.convertAndSend(exchange, "order.created", event);
    }

    public void publishOrderPaid(OrderPaidEvent event) {
        log.info("Publishing order paid event: {}", event.getOrderId());
        rabbitTemplate.convertAndSend(exchange, "order.paid", event);
    }

    public void publishOrderShipped(OrderShippedEvent event) {
        log.info("Publishing order shipped event: {}", event.getOrderId());
        rabbitTemplate.convertAndSend(exchange, "order.shipped", event);
    }
}
