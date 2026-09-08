package com.novatech.retail_system_backend.exception;

public class ProductNotFoundException extends RuntimeException {
    public ProductNotFoundException(Long productID) {
        super("Product not found with id : "+productID);
    }
}
