package com.novatech.retail_system_backend.exception;

public class InvalidStockMovementException extends RuntimeException {

    public InvalidStockMovementException(String message) {
        super(message);
    }
}
