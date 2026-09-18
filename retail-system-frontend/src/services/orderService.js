import api from "./api";

// Create a new order
export const createOrder = async (order) => {
    const response = await api.post("/orders", order);
    return response.data;
};

// Get all orders
export const getOrders = async () => {
    const response = await api.get("/orders");
    return response.data;
};

// Get order by ID
export const getOrderById = async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
};

// Get orders for a customer
export const getOrdersByCustomer = async (customerId) => {
    const response = await api.get(
        `/orders/customer/${customerId}`
    );

    return response.data;
};

