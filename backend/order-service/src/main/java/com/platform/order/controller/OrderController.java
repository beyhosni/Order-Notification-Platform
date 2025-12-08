package com.platform.order.controller;

import com.platform.order.dto.CreateOrderRequest;
import com.platform.order.entity.Order;
import com.platform.order.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<Order> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        return ResponseEntity.ok(orderService.createOrder(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable String id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getOrdersByUserId(@PathVariable String userId) {
        return ResponseEntity.ok(orderService.getOrdersByUserId(userId));
    }

    @PostMapping("/{id}/pay")
    public ResponseEntity<Order> markAsPaid(@PathVariable String id, @RequestParam String paymentId) {
        return ResponseEntity.ok(orderService.markAsPaid(id, paymentId));
    }

    @PostMapping("/{id}/ship")
    public ResponseEntity<Order> markAsShipped(@PathVariable String id, @RequestParam String trackingNumber) {
        return ResponseEntity.ok(orderService.markAsShipped(id, trackingNumber));
    }
}
