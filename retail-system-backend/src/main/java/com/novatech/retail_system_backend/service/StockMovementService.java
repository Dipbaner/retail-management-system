package com.novatech.retail_system_backend.service;

import com.novatech.retail_system_backend.dto.StockMovementRequest;
import com.novatech.retail_system_backend.model.Product;
import com.novatech.retail_system_backend.model.StockMovement;
import com.novatech.retail_system_backend.repository.ProductRepository;
import com.novatech.retail_system_backend.repository.StockMovementRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StockMovementService {

    private final ProductRepository productRepository;
    private final StockMovementRepository stockMovementRepository;

    public StockMovementService(
            ProductRepository productRepository,
            StockMovementRepository stockMovementRepository) {

        this.productRepository = productRepository;
        this.stockMovementRepository = stockMovementRepository;
    }


    @Transactional
    public StockMovement createMovement(StockMovementRequest request) {

        // Validation
        if (request.getProductId() == null) {
            throw new RuntimeException("Product ID is required");
        }

        if (request.getType() == null) {
            throw new RuntimeException("Stock movement type is required");
        }

        if (request.getQuantity() == null || request.getQuantity() <= 0) {
            throw new RuntimeException("Quantity must be greater than 0");
        }


        // Find product
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() ->
                        new RuntimeException("Product not found")
                );


        // Current quantity
        int quantityBefore = product.getQuantity() == null
                ? 0
                : product.getQuantity();

        int movementQuantity = request.getQuantity();

        int quantityAfter;


        // STOCK IN
        if (request.getType() == StockMovement.MovementType.STOCK_IN) {

            quantityAfter = quantityBefore + movementQuantity;

        }

        // STOCK OUT
        else {

            if (movementQuantity > quantityBefore) {
                throw new RuntimeException("Insufficient stock");
            }

            quantityAfter = quantityBefore - movementQuantity;
        }


        // Update product quantity
        product.setQuantity(quantityAfter);
        productRepository.save(product);


        // Create movement record
        StockMovement movement = new StockMovement();

        movement.setProductId(product.getId());
        movement.setType(request.getType());
        movement.setQuantity(movementQuantity);
        movement.setQuantityBefore(quantityBefore);
        movement.setQuantityAfter(quantityAfter);
        movement.setReason(request.getReason());


        return stockMovementRepository.save(movement);
    }


    public List<StockMovement> getAllMovements() {
        return stockMovementRepository.findAll();
    }


    public List<StockMovement> getMovementsByProducts(Long productId) {

        return stockMovementRepository
                .findByProductIdOrderByCreatedAtDesc(productId);
    }
}