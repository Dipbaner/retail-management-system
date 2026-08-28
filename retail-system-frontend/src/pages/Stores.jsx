
import { useEffect, useState, useCallback } from "react";

import "./Stores.css";

import {
    getStores,
    createStore,
    updateStore,
    deleteStore
} from "../services/storeService";

import StoreTable from "../components/StoreTable";
import StoreForm from "../components/StoreForm";


function Stores() {

    const [stores, setStores] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);

    const [editingStore, setEditingStore] = useState(null);


    const loadStores = useCallback(async () => {

    try {

        setLoading(true);
        setError("");

        const data = await getStores();

        setStores(data);

    } catch (error) {

        console.error("Load stores error:", error);

        setError("Failed to load stores.");

    } finally {

        setLoading(false);
    }

}, []);

    // Load stores when component is mounted
    useEffect(() => {
        loadStores();
    }, [loadStores]);

   const handleCreate = async (store) => {

    try {

        setError("");

        const newStore = await createStore(store);

        setStores((previousStores) => [
            ...previousStores,
            newStore
        ]);

        setShowForm(false);

    } catch (error) {

        console.error("Create store error:", error);

        setError(
            error.response?.data?.message ||
            "Failed to create store."
        );
    }
};


    const handleUpdate = async (store) => {

    try {

        setError("");

        const updatedStore = await updateStore(
            editingStore.id,
            store
        );

        setStores((previousStores) =>
            previousStores.map((item) =>
                item.id === updatedStore.id
                    ? updatedStore
                    : item
            )
        );

        setEditingStore(null);

    } catch (error) {

        console.error("Update store error:", error);

        setError(
            error.response?.data?.message ||
            "Failed to update store."
        );
    }
};

    const handleDelete = async (id) => {

    const confirmed = window.confirm(
        "Are you sure you want to delete this store?"
    );

    if (!confirmed) {
        return;
    }

    try {

        setError("");

        await deleteStore(id);

        setStores((previousStores) =>
            previousStores.filter(
                (store) => store.id !== id
            )
        );

    } catch (error) {

        console.error("Delete store error:", error);

        setError(
            error.response?.data?.message ||
            "Failed to delete store."
        );
    }
};

    if (loading) {
    return (
        <div className="loading">
            <h2>Loading stores...</h2>
        </div>
    );
}


    return (
    <div className="store-page">

        {/* Header */}
        <div className="store-header">

            <div>
                <h1>Store Management</h1>

                <p>
                    Manage your retail stores and locations
                </p>
            </div>

            {/* Don't show Add Store button while form is open */}
            {!showForm && !editingStore && (
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        setError("");
                        setEditingStore(null);
                        setShowForm(true);
                    }}
                >
                    + Add Store
                </button>
            )}

        </div>


        {/* Error */}
        {error && (
            <div className="error-message">
                {error}
            </div>
        )}


        {/* =========================
            ADD / EDIT FORM
           ========================= */}

        {(showForm || editingStore) ? (

            <div className="store-form-wrapper">

                <div className="store-form-card">

                    <StoreForm
                        initialData={editingStore}
                        onSubmit={
                            editingStore
                                ? handleUpdate
                                : handleCreate
                        }
                        onCancel={() => {
                            setShowForm(false);
                            setEditingStore(null);
                            setError("");
                        }}
                    />

                </div>

            </div>

        ) : (

            /* =========================
               STORE TABLE
               ========================= */

            stores.length === 0 ? (

                <div className="store-table-card">

                    <div className="empty-state">

                        <h3>No stores found</h3>

                        <p>
                            Start by adding your first store.
                        </p>

                    </div>

                </div>

            ) : (

                <div className="store-table-card">

                    <StoreTable
                        stores={stores}
                        onEdit={(store) => {
                            setError("");
                            setShowForm(false);
                            setEditingStore(store);
                        }}
                        onDelete={handleDelete}
                    />

                </div>

            )

        )}

    </div>
);
}


export default Stores;

