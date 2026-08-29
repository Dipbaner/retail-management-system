package com.novatech.retail_system_backend.service;

import com.novatech.retail_system_backend.model.Product;
import com.novatech.retail_system_backend.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository){
        this.productRepository = productRepository;
    }

    // GET ALL PRODUCTS

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // GET PRODUCT BY ID

    public Product findById(Long id) {
        return productRepository.findById(id).orElseThrow(
                () -> new RuntimeException
                        ("product not found with id: " + id)
        );
    }

    // CREATE PRODUCT

    public Product createProduct(Product product){
        validateProduct(product);

        if(productRepository.existsBySku(product.getSku())) {
            throw new RuntimeException(
                    "Product with SKU already exists: " + product.getSku()
            );
        }
        return productRepository.save(product);
    }

    // UPDATE PRODUCT

    public Product updateProduct(Long id, Product updatedProduct) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow( () -> new RuntimeException(
                        "Product not found with id: " + id)
                );

        validateProduct(updatedProduct);

        if(!existingProduct.getSku().equals(updatedProduct.getSku())
        && productRepository.existsBySku(updatedProduct.getSku())) {
            throw new RuntimeException(
                    "Product with SKU already exists: " +
                            updatedProduct.getSku()
            );
        }

        existingProduct.setProductName(updatedProduct.getProductName());
        existingProduct.setSku(updatedProduct.getSku());
        existingProduct.setCategory(updatedProduct.getCategory());
        existingProduct.setPrice(updatedProduct.getPrice());
        existingProduct.setQuantity(updatedProduct.getQuantity());
        existingProduct.setDescription(updatedProduct.getDescription());
        existingProduct.setStoreId(updatedProduct.getStoreId());

        return productRepository.save(existingProduct);
    }

    public void deleteProduct(Long id){
        if(!productRepository.existsById(id)) {
            throw new RuntimeException(
                    "Product not found with id : " + id
            );
        }
        productRepository.deleteById(id);
    }

    private void validateProduct(Product product) {

        if(product.getProductName() == null ||
            product.getProductName().trim().isEmpty()) {
            throw new IllegalArgumentException(
                    "Product name is required.");
        }

        if(product.getSku() == null ||
                product.getSku().trim().isEmpty()) {
            throw new IllegalArgumentException("SKU is required.");
        }

        if(product.getPrice() == null ||
            product.getPrice().signum() < 0) {
            throw new IllegalArgumentException(
                    "Price must be greater than or equal to 0."
            );
        }

        if(product.getCategory() == null ||
            product.getCategory().trim().isEmpty()) {
            throw new IllegalArgumentException(
                    "Category is required."
            );
        }

        if(product.getQuantity() == null ||
            product.getQuantity() < 0) {
            throw new IllegalArgumentException(
                    "Quantity must be greater than or equal to 0."
            );
        }

        if(product.getStoreId() == null) {
            throw new IllegalArgumentException("Store ID is required.");
        }
    }


}

