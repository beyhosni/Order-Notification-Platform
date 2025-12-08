package com.platform.order.service;

import com.platform.order.entity.Order;
import com.platform.order.entity.OrderItem;
import com.platform.order.entity.Order.OrderStatus;
import com.platform.order.repository.OrderRepository;
import com.platform.order.messaging.EventPublisher;
import com.platform.order.dto.CreateOrderRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private EventPublisher eventPublisher;

    @InjectMocks
    private OrderService orderService;

    private CreateOrderRequest createOrderRequest;
    private Order mockOrder;

    @BeforeEach
    void setUp() {
        createOrderRequest = new CreateOrderRequest();
        createOrderRequest.setUserId("user123");

        CreateOrderRequest.OrderItemRequest item = new CreateOrderRequest.OrderItemRequest();
        item.setProductId("product123");
        item.setProductName("Test Product");
        item.setQuantity(2);
        item.setPrice(new BigDecimal("50.00"));

        createOrderRequest.setItems(Arrays.asList(item));

        mockOrder = new Order();
        mockOrder.setId("order123");
        mockOrder.setUserId("user123");
        mockOrder.setStatus(OrderStatus.PENDING);
        mockOrder.setTotalAmount(new BigDecimal("100.00"));
    }

    @Test
    void createOrder_Success() {
        // Arrange
        when(orderRepository.save(any(Order.class))).thenReturn(mockOrder);

        // Act
        Order result = orderService.createOrder(createOrderRequest);

        // Assert
        assertNotNull(result);
        assertEquals("user123", result.getUserId());
        assertEquals(OrderStatus.PENDING, result.getStatus());
        verify(orderRepository, times(1)).save(any(Order.class));
        verify(eventPublisher, times(1)).publishOrderCreated(any(Order.class));
    }

    @Test
    void getOrderById_Success() {
        // Arrange
        when(orderRepository.findById("order123")).thenReturn(Optional.of(mockOrder));

        // Act
        Order result = orderService.getOrderById("order123");

        // Assert
        assertNotNull(result);
        assertEquals("order123", result.getId());
        verify(orderRepository, times(1)).findById("order123");
    }

    @Test
    void getOrderById_NotFound() {
        // Arrange
        when(orderRepository.findById("nonexistent")).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> orderService.getOrderById("nonexistent"));
    }

    @Test
    void markAsPaid_Success() {
        // Arrange
        when(orderRepository.findById("order123")).thenReturn(Optional.of(mockOrder));
        when(orderRepository.save(any(Order.class))).thenReturn(mockOrder);

        // Act
        Order result = orderService.markAsPaid("order123", "payment123");

        // Assert
        assertNotNull(result);
        verify(eventPublisher, times(1)).publishOrderPaid(eq("order123"), eq("payment123"));
    }

    @Test
    void calculateTotalAmount_Correct() {
        // Act
        Order order = orderService.createOrder(createOrderRequest);

        // Assert
        assertEquals(new BigDecimal("100.00"), order.getTotalAmount());
    }
}
