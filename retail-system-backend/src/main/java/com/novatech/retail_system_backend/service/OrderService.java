package com.novatech.retail_system_backend.service;

import com.novatech.retail_system_backend.dto.OrderItemRequest;
import com.novatech.retail_system_backend.dto.OrderRequest;
import com.novatech.retail_system_backend.dto.StockMovementRequest;
import com.novatech.retail_system_backend.model.*;
import com.novatech.retail_system_backend.repository.CustomerRepository;
import com.novatech.retail_system_backend.repository.OrderItemRepository;
import com.novatech.retail_system_backend.repository.OrderRepository;
import com.novatech.retail_system_backend.repository.ProductRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@AllArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;
    private final StockMovementService stockMovementService;

    @Transactional
    public Order createOrder(OrderRequest request) {

        // ==========================================
        // 1. VERIFY CUSTOMER EXISTS
        // ==========================================

        if (!customerRepository.existsById(request.getCustomerId())) {
            throw new IllegalArgumentException(
                    "Customer not found with id : " + request.getCustomerId()
            );
        }

        // ==========================================
        // 2. PREVENT DUPLICATE PRODUCTS
        // ==========================================

        Set<Long> productIds = new HashSet<>();

        for (OrderItemRequest item : request.getItems()) {

            if (!productIds.add(item.getProductId())) {
                throw new IllegalArgumentException(
                        "Product appears more than once in the order : "
                                + item.getProductId()
                );
            }
        }

        // ==========================================
        // 3. CREATE ORDER
        // ==========================================

        Order order = new Order();

        order.setCustomerId(request.getCustomerId());
        order.setStatus(OrderStatus.PENDING);
        order.setCreatedAt(LocalDateTime.now());

        BigDecimal subtotal = BigDecimal.ZERO;

        BigDecimal discount = request.getDiscount();

        if (discount == null) {
            discount = BigDecimal.ZERO;
        }

        // ==========================================
        // 4. PROCESS ORDER ITEMS
        // ==========================================

        for (OrderItemRequest itemRequest : request.getItems()) {

            Product product = productRepository.findById(
                    itemRequest.getProductId()
            ).orElseThrow(() -> new IllegalArgumentException(
                    "Product not found with id : "
                            + itemRequest.getProductId()
            ));

            // ======================================
            // CHECK STOCK
            // ======================================

            if (product.getQuantity() < itemRequest.getQuantity()) {

                throw new IllegalArgumentException(
                        "Insufficient stock for product : "
                                + product.getProductName()
                );
            }

            // ======================================
            // CALCULATE ITEM TOTAL
            // ======================================

            BigDecimal unitPrice = product.getPrice();

            BigDecimal itemTotal = unitPrice.multiply(
                    BigDecimal.valueOf(itemRequest.getQuantity())
            );

            subtotal = subtotal.add(itemTotal);

            // ======================================
            // CREATE ORDER ITEM
            // ======================================

            OrderItem orderItem = new OrderItem();

            orderItem.setProductId(product.getId());
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setUnitPrice(unitPrice);
            orderItem.setTotalPrice(itemTotal);

            // VERY IMPORTANT
            orderItem.setOrder(order);

            // Add item to order
            order.getItems().add(orderItem);
        }

        // ==========================================
        // 5. VALIDATE DISCOUNT
        // ==========================================

        if (discount.compareTo(subtotal) > 0) {

            throw new IllegalArgumentException(
                    "Discount cannot be greater than subtotal"
            );
        }

        // ==========================================
        // 6. CALCULATE FINAL TOTAL
        // ==========================================

        BigDecimal totalAmount = subtotal.subtract(discount);

        // ==========================================
        // 7. SET ORDER AMOUNTS
        // ==========================================

        order.setSubtotal(subtotal);
        order.setDiscount(discount);
        order.setTotalAmount(totalAmount);

        // ==========================================
        // 8. SAVE ORDER
        // ==========================================

        Order savedOrder = orderRepository.save(order);

        // ==========================================
        // 9. REDUCE INVENTORY
        // ==========================================

        for (OrderItem item : savedOrder.getItems()) {

            StockMovementRequest movementRequest =
                    new StockMovementRequest();

            movementRequest.setProductId(item.getProductId());

            movementRequest.setType(
                    StockMovement.MovementType.STOCK_OUT
            );

            movementRequest.setQuantity(
                    item.getQuantity()
            );

            movementRequest.setReason(
                    "Sale - Order #" + savedOrder.getId()
            );

            stockMovementService.createMovement(
                    movementRequest
            );
        }

        // ==========================================
        // 10. MARK ORDER COMPLETED
        // ==========================================

        savedOrder.setStatus(OrderStatus.COMPLETED);

        return orderRepository.save(savedOrder);
    }

    // ==============================================
    // GET ALL ORDERS
    // ==============================================

    public List<Order> getAllOrders() {

        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    // ==============================================
    // GET ORDER BY ID
    // ==============================================

    public Order getOrderById(Long id) {

        return orderRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Order not found with id : " + id
                        )
                );
    }

    // ==============================================
    // GET ORDER ITEMS
    // ==============================================

    public List<OrderItem> getOrderItems(Long orderId) {

        // Make sure order exists
        getOrderById(orderId);

        return orderItemRepository.findByOrderId(orderId);
    }

    // ==============================================
    // GET ORDERS BY CUSTOMER
    // ==============================================

    public List<Order> getOrdersByCustomer(Long customerId) {

        if (!customerRepository.existsById(customerId)) {

            throw new IllegalArgumentException(
                    "Customer not found with id : " + customerId
            );
        }

        return orderRepository
                .findByCustomerIdOrderByCreatedAtDesc(customerId);
    }
}