import api from "./api";

export const getStores = async () => {
    const response = await api.get("/stores");
    return response.data;
};

export const getStoreById = async (id) => {
    const response = await api.get(`/stores/${id}`);
    return response.data;
};

export const createStore = async (store) => {
    const response = await api.post("/stores", store);
    return response.data;
};

export const updateStore = async (id, store) => {
    const response = await api.put(`/stores/${id}`, store);
    return response.data;
};

export const deleteStore = async (id) => {
    await api.delete(`/stores/${id}`);
};

