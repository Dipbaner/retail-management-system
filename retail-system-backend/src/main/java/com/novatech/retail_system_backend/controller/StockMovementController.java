package com.novatech.retail_system_backend.controller;

import com.novatech.retail_system_backend.dto.StockMovementRequest;
import com.novatech.retail_system_backend.model.StockMovement;
import com.novatech.retail_system_backend.service.StockMovementService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = "http://localhost:5173")
public class StockMovementController {

    private final StockMovementService stockMovementService;

    public StockMovementController(StockMovementService stockMovementService){
        this.stockMovementService = stockMovementService;
    }

    // CREATE STOCK MOVEMENT
    @PostMapping("/movements")
    public ResponseEntity<StockMovement> createMovement(
            @Valid @RequestBody StockMovementRequest request) {

        StockMovement movement = stockMovementService
                .createMovement(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(movement);
    }

    // GET ALL MOVEMENTS
    @GetMapping("/movements")
    public ResponseEntity<List<StockMovement>> getAllMovements() {
        return ResponseEntity.ok(stockMovementService.getAllMovements());
    }

    // GET MOVEMENTS BY PRODUCT
    @GetMapping("/movements/product/{productId}")
    public ResponseEntity<List<StockMovement>> getMovementsByProduct(
            @PathVariable("productId") Long productId) {
        System.out.println("Inside getMovementsByProduct method.");
        return ResponseEntity.ok(stockMovementService
                .getMovementsByProducts(productId));
    }

}
