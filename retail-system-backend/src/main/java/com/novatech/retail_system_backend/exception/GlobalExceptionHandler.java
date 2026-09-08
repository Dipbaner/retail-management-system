package com.novatech.retail_system_backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // PRODUCT NOT FOUND
    @ExceptionHandler(ProductNotFoundException.class)
    public ResponseEntity<ApiError> handleProductNotFound(
            ProductNotFoundException exception
    ) {
        ApiError error = new ApiError(HttpStatus.NOT_FOUND.value(),
                exception.getMessage());

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    // INSUFFICIENT STOCK
    @ExceptionHandler(InsufficientStockException.class)
    public ResponseEntity<ApiError> handleInsufficientStock(
            InsufficientStockException exception
    ) {
        ApiError error = new ApiError(HttpStatus.BAD_REQUEST.value(),
                exception.getMessage());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    // INVALID STOCK MOVEMENT
    @ExceptionHandler(InvalidStockMovementException.class)
    public ResponseEntity<ApiError> handleInvalidStockMovement(
            InvalidStockMovementException exception
    ) {
        ApiError error = new ApiError(HttpStatus.BAD_REQUEST.value(),
                exception.getMessage());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    // GENERIC ERROR
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleGenericException(Exception
                                                           exception) {
        exception.printStackTrace();

        ApiError error = new ApiError(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "An unexpected error occurred."
        );

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(error);
    }

    @ExceptionHandler(org.springframework.web.bind.MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidationException(
            org.springframework.web.bind.MethodArgumentNotValidException exception
    ) {
        String message = exception.getBindingResult()
                .getFieldErrors()
                .stream()
                .findFirst()
                .map(error -> error.getDefaultMessage())
                .orElse("Invalid request");

        ApiError error = new ApiError(HttpStatus.BAD_REQUEST.value(),
                message);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

}
