package com.platform.order.controller;

import com.platform.order.entity.Order;
import com.platform.order.service.OrderService;
import com.platform.order.dto.CreateOrderRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(OrderController.class)
class OrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private OrderService orderService;

    @Test
    void createOrder_Success() throws Exception {
        // Arrange
        CreateOrderRequest request = new CreateOrderRequest();
        request.setUserId("user123");

        Order mockOrder = new Order();
        mockOrder.setId("order123");
        mockOrder.setUserId("user123");
        mockOrder.setTotalAmount(new BigDecimal("100.00"));

        when(orderService.createOrder(any(CreateOrderRequest.class))).thenReturn(mockOrder);

        // Act & Assert
        mockMvc.perform(post("/api/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("order123"))
                .andExpect(jsonPath("$.userId").value("user123"));
    }

    @Test
    void getOrderById_Success() throws Exception {
        // Arrange
        Order mockOrder = new Order();
        mockOrder.setId("order123");
        mockOrder.setUserId("user123");

        when(orderService.getOrderById("order123")).thenReturn(mockOrder);

        // Act & Assert
        mockMvc.perform(get("/api/orders/order123"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("order123"));
    }

    @Test
    void getOrdersByUserId_Success() throws Exception {
        // Arrange
        Order order1 = new Order();
        order1.setId("order1");
        order1.setUserId("user123");

        Order order2 = new Order();
        order2.setId("order2");
        order2.setUserId("user123");

        List<Order> orders = Arrays.asList(order1, order2);
        when(orderService.getOrdersByUserId("user123")).thenReturn(orders);

        // Act & Assert
        mockMvc.perform(get("/api/orders/user/user123"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(2));
    }
}
