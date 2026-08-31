import api from "./api";

//  GET ALL PRODUCTS

export const getProducts = async () => {
    const response = await api.get("/products");
    return response.data;
}

// GET PRODUCT BY ID

export const getProductByID = async (id) => {
    const response = await api.get(
        `/products/${id}`
    );
    return response.data;
}

// CREATE PRODUCT 

export const createProduct = async (product) => {
    const response = await api.post(
        "/products", product
    );
    return response.data;
}

// UPDATE PRODUCT

export const updateProduct = async (id, product) => {
    const response = await api.put(`/products/${id}`, product);
    return response.data;
}

// DELETE PRODUCT

export const deleteProduct = async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
}