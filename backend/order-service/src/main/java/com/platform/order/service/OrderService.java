package com.platform.order.service;

import com.platform.order.dto.CreateOrderRequest;
import com.platform.order.entity.Order;
import com.platform.order.entity.OrderItem;
import com.platform.order.messaging.EventPublisher;
import com.platform.order.repository.OrderRepository;
import com.platform.shared.events.OrderCreatedEvent;
import com.platform.shared.events.OrderPaidEvent;
import com.platform.shared.events.OrderShippedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final EventPublisher eventPublisher;

    @Transactional
    public Order createOrder(CreateOrderRequest request) {
        Order order = new Order();
        order.setUserId(request.getUserId());
        order.setStatus(Order.OrderStatus.PENDING);

        // Create order items - capture final reference for lambda
        final Order finalOrder = order;
        List<OrderItem> items = request.getItems().stream().map(itemReq -> {
            OrderItem item = new OrderItem();
            item.setOrder(finalOrder);
            item.setProductId(itemReq.getProductId());
            item.setProductName(itemReq.getProductName());
            item.setQuantity(itemReq.getQuantity());
            item.setPrice(itemReq.getPrice());
            return item;
        }).collect(Collectors.toList());

        order.setItems(items);

        // Calculate total
        BigDecimal total = items.stream()
                .map(OrderItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        order.setTotalAmount(total);

        order = orderRepository.save(order);

        // Publish order created event
        OrderCreatedEvent event = new OrderCreatedEvent();
        event.setOrderId(order.getId());
        event.setUserId(order.getUserId());
        event.setTotalAmount(order.getTotalAmount());
        event.setCreatedAt(order.getCreatedAt());

        List<OrderCreatedEvent.OrderItem> eventItems = items.stream().map(item -> {
            OrderCreatedEvent.OrderItem eventItem = new OrderCreatedEvent.OrderItem();
            eventItem.setProductId(item.getProductId());
            eventItem.setProductName(item.getProductName());
            eventItem.setQuantity(item.getQuantity());
            eventItem.setPrice(item.getPrice());
            return eventItem;
        }).collect(Collectors.toList());
        event.setItems(eventItems);

        eventPublisher.publishOrderCreated(event);

        log.info("Order created: {}", order.getId());
        return order;
    }

    public Order getOrderById(String id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    public List<Order> getOrdersByUserId(String userId) {
        return orderRepository.findByUserId(userId);
    }

    @Transactional
    public Order markAsPaid(String orderId, String paymentId) {
        Order order = getOrderById(orderId);
        order.setStatus(Order.OrderStatus.PAID);
        order = orderRepository.save(order);

        OrderPaidEvent event = new OrderPaidEvent();
        event.setOrderId(orderId);
        event.setPaymentId(paymentId);
        event.setPaymentMethod("CREDIT_CARD");
        event.setPaidAt(LocalDateTime.now());

        eventPublisher.publishOrderPaid(event);

        return order;
    }

    @Transactional
    public Order markAsShipped(String orderId, String trackingNumber) {
        Order order = getOrderById(orderId);
        order.setStatus(Order.OrderStatus.SHIPPED);
        order = orderRepository.save(order);

        OrderShippedEvent event = new OrderShippedEvent();
        event.setOrderId(orderId);
        event.setTrackingNumber(trackingNumber);
        event.setCarrier("UPS");
        event.setShippedAt(LocalDateTime.now());

        eventPublisher.publishOrderShipped(event);

        return order;
    }
}
