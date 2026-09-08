import axios from "axios";

const API_URL = "http://localhost:8080/api/inventory";

// Get all stock movements
export const getStockMovements = async () => {
    const response = await axios.get(
        `${API_URL}/movements`
    );

    return response.data;
};


// Get movements for specific product
export const getProductStockMovements = async (productId) => {
    const response = await axios.get(
        `${API_URL}/movements/product/${productId}`
    );

    return response.data;
};


// Create stock movement
export const createStockMovement = async (movement) => {

    console.log("Sending movement:", movement);

    const response = await axios.post(
        `${API_URL}/movements`,
        movement
    );

    return response.data;
};