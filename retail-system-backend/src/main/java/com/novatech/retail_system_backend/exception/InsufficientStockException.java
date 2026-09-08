package com.novatech.retail_system_backend.exception;

public class InsufficientStockException extends RuntimeException {

    public InsufficientStockException(int available, int requested) {
        super("Insufficient stock. Available : "+available
                + ", Requested : "+requested);
    }
}
