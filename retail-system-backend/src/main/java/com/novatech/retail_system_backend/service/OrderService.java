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

        // VERIFY CUSTOMER EXISTS
        if (!customerRepository.existsById(request.getCustomerId())) {
            throw new IllegalArgumentException(
                    "Customer not found with id : " + request.getCustomerId()
            );
        }

        // Prevent duplicate products in same order
        Set<Long> productIds = new HashSet<>();

        for (OrderItemRequest item : request.getItems()) {
            if (!productIds.add(item.getProductId())) {
                throw new IllegalArgumentException(
                        "Product appears more than once in the order : "
                                + item.getProductId()
                );
            }
        }

        // CREATE ORDER
        Order order = new Order();

        order.setCustomerId(request.getCustomerId());
        order.setStatus(OrderStatus.COMPLETED);
        order.setCreatedAt(LocalDateTime.now());
        order.setTotalAmount(BigDecimal.ZERO);

        Order savedOrder = orderRepository.save(order);

        BigDecimal totalAmount = BigDecimal.ZERO;

        // Process every product

        for (OrderItemRequest itemRequest : request.getItems()) {

            Product product = productRepository.findById(
                    itemRequest.getProductId()
            ).orElseThrow(() -> new IllegalArgumentException(
                    "Product not found with id : " +
                            itemRequest.getProductId()
            ));

            // Calculate subtotal
            BigDecimal unitPrice = product.getPrice();

            BigDecimal subtotal = unitPrice.multiply(
                    BigDecimal.valueOf(itemRequest.getQuantity())
            );

            // Reduce Inventory
            StockMovementRequest movementRequest =
                    new StockMovementRequest();

            movementRequest.setProductId(product.getId());
            movementRequest.setType(StockMovement.MovementType.STOCK_OUT);
            movementRequest.setQuantity(itemRequest.getQuantity());
            movementRequest.setReason("Sale - Order #" + savedOrder.getId());

            stockMovementService.createMovement(movementRequest);

            // CREATE ORDER ITEMS
            OrderItem orderItem = new OrderItem();

            orderItem.setOrderId(savedOrder.getId());
            orderItem.setProductId(product.getId());
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setUnitPrice(unitPrice);
            orderItem.setSubTotal(subtotal);

            orderItemRepository.save(orderItem);

            // ADD TO TOTAL
            totalAmount = totalAmount.add(subtotal);
        }
        savedOrder.setTotalAmount(totalAmount);
        return orderRepository.save(savedOrder);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow( () ->
                        new IllegalArgumentException(
                                "Order not found with id : " +id
                        ));
    }

    public List<OrderItem> getOrderItems(Long orderId) {

        // Make sure order exists
        getOrderById(orderId);

        return orderItemRepository.findByOrderId(orderId);
    }

    public List<Order> getOrdersByCustomer(Long customerId) {
        if(!customerRepository.existsById(customerId)) {
            throw new IllegalArgumentException(
                    "Customer not found with id : "+customerId
            );
        }
        return orderRepository.findByCustomerIdOrderByCreatedAtDesc(customerId);
    }

}
