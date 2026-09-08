package com.novatech.retail_system_backend.repository;

import com.novatech.retail_system_backend.model.StockMovement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockMovementRepository extends
        JpaRepository <StockMovement, Long> {

    List<StockMovement> findByProductIdOrderByCreatedAtDesc(
            Long productId);

    List<StockMovement> findAllByOrderByCreatedAtDesc();
}
