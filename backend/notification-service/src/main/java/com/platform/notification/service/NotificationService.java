package com.platform.notification.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class NotificationService {

    public void sendOrderCreatedNotification(String orderId, String userId, String totalAmount) {
        // In a real implementation, this would send email, SMS, push notification, etc.
        log.info("===========================================");
        log.info("📧 NOTIFICATION: Order Created");
        log.info("Order ID: {}", orderId);
        log.info("User ID: {}", userId);
        log.info("Total Amount: {}", totalAmount);
        log.info("Message: Your order has been created successfully!");
        log.info("===========================================");
    }

    public void sendOrderPaidNotification(String orderId, String paymentId) {
        log.info("===========================================");
        log.info("💳 NOTIFICATION: Order Paid");
        log.info("Order ID: {}", orderId);
        log.info("Payment ID: {}", paymentId);
        log.info("Message: Your payment has been processed successfully!");
        log.info("===========================================");
    }

    public void sendOrderShippedNotification(String orderId, String trackingNumber, String carrier) {
        log.info("===========================================");
        log.info("📦 NOTIFICATION: Order Shipped");
        log.info("Order ID: {}", orderId);
        log.info("Tracking Number: {}", trackingNumber);
        log.info("Carrier: {}", carrier);
        log.info("Message: Your order has been shipped!");
        log.info("===========================================");
    }
}
