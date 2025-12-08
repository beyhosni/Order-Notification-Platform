package com.platform.inventory.service;

import com.platform.inventory.entity.Inventory;
import com.platform.inventory.repository.InventoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InventoryServiceTest {

    @Mock
    private InventoryRepository inventoryRepository;

    @InjectMocks
    private InventoryService inventoryService;

    private Inventory mockInventory;

    @BeforeEach
    void setUp() {
        mockInventory = new Inventory();
        mockInventory.setId("inv123");
        mockInventory.setProductId("product123");
        mockInventory.setQuantity(100);
        mockInventory.setReserved(0);
    }

    @Test
    void reserveInventory_Success() {
        // Arrange
        when(inventoryRepository.findByProductId("product123")).thenReturn(Optional.of(mockInventory));
        when(inventoryRepository.save(any(Inventory.class))).thenReturn(mockInventory);

        // Act
        inventoryService.reserveInventory("product123", 10);

        // Assert
        assertEquals(10, mockInventory.getReserved());
        verify(inventoryRepository, times(1)).save(mockInventory);
    }

    @Test
    void reserveInventory_InsufficientStock() {
        // Arrange
        when(inventoryRepository.findByProductId("product123")).thenReturn(Optional.of(mockInventory));

        // Act & Assert
        assertThrows(RuntimeException.class, () -> inventoryService.reserveInventory("product123", 200));
    }

    @Test
    void canReserve_True() {
        // Assert
        assertTrue(mockInventory.canReserve(50));
    }

    @Test
    void canReserve_False() {
        // Assert
        assertFalse(mockInventory.canReserve(150));
    }
}
