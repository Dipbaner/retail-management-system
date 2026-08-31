import { useEffect, useState } from "react";

import { getProducts, createProduct, updateProduct, deleteProduct }
    from "../services/productService";

import { getStores } from "../services/storeService";

import ProductTable from "../components/ProductTable";

import ProductForm from "../components/ProductForm";

import "./Products.css";

function Products() {

    const [products, setProducts] = useState([]);

    const [stores, setStores] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);

    const [editingProduct, setEditingProduct] = useState(null);

    const [submitting, setSubmitting] = useState(false);

    const [deletingId, setDeletingId] = useState(null);

    // LOAD PRODUCTS

    const loadProducts = async () => {
        try {
            setLoading(true);
            setError("");
            const data = await getProducts();
            setProducts(data);
        }
        catch (error) {
            console.error("Load products error : ", error);

            setError(error.response?.data?.message || "Failed to load products.");

        }
        finally {
            setLoading(false);
        }
    };

    // LOAD STORES

    const loadStores = async () => {

        try {
            const data = await getStores();

            setStores(data);
        }
        catch (error) {
            console.error("Load stores error : ", error);

            setError("Failed to load stores.");
        }
    };

    // INITIAL LOAD

    useEffect(() => {

        const loadInitialData = async () => {

            try {

                setLoading(true);

                setError("");

                const [productsData, storesData] = await Promise.all
                    ([getProducts(), getStores()]);

                setProducts(productsData);

                setStores(storesData);
            }

            catch (error) {

                console.error("Load product page error : ", error);

                setError(error.response?.data?.message ||
                    "Failed to load product data."
                );
            }

            finally {
                setLoading(false);
            }
        };

        loadInitialData();

    }, []);

    // CREATE PRODUCT 

    const handleCreate = async (product) => {

        try {

            setError("");

            setSubmitting(true);

            const newProduct = await createProduct(product);

            setProducts((previousProducts) => [
                ...previousProducts, newProduct
            ]);

            setShowForm(false);
        }

        catch (error) {
            console.error("Create product error : ", error);

            setError(error.response?.data?.message ||
                "Failed to create product."
            );

        }

        finally {
            setSubmitting(false);
        }
    };

    // UPDATE PRODUCT 

    const handleUpdate = async (product) => {

        try {

            setError("");

            setSubmitting(true);

            const updatedProduct = await updateProduct(
                editingProduct.id,
                product
            );

            setProducts((previousProducts) =>
                previousProducts.map((item) =>
                    item.id === updatedProduct.id
                        ? updatedProduct
                        : item
                )
            );

            setEditingProduct(null);

            setShowForm(false);

        } catch (error) {

            console.error("Update Product Error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to update product."
            );

        } finally {

            setSubmitting(false);
        }
    };

    // DELETE PRODUCT 

    const handleDelete = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmed) {
            return;
        }


        try {

            setError("");

            setDeletingId(id);

            await deleteProduct(id);

            setProducts((previousProducts) =>
                previousProducts.filter(
                    (product) =>
                        product.id !== id
                )
            );

        } catch (error) {

            console.error(
                "Delete product error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to delete product."
            );

        } finally {

            setDeletingId(null);
        }
    };

    // LOADING 

    if (loading) {

        return (
            <div className="products-page">

                <div className="products-loading">

                    <div className="loading-spinner"></div>

                    <p>
                        Loading products...
                    </p>

                </div>

            </div>
        );
    }

    // RENDER

    return (

        <div className="products-page">

            <div className="products-container">

                {/* ====================================
                    HEADER
                   ==================================== */}

                <div className="products-header">

                    <div>

                        <h1>
                            Product Management
                        </h1>

                        <p>
                            Manage your retail products
                        </p>

                    </div>


                    {!showForm &&
                        !editingProduct && (

                            <button
                                className="add-product-btn"
                                onClick={() => {

                                    setError("");

                                    setEditingProduct(null);

                                    setShowForm(true);

                                }}
                            >
                                + Add Product
                            </button>

                        )}

                </div>


                {/* ====================================
                    ERROR
                   ==================================== */}

                {error && (

                    <div className="error-message">

                        {error}

                    </div>

                )}


                {/* ====================================
                    PRODUCT FORM
                   ==================================== */}

                {(showForm || editingProduct) && (

                    <ProductForm
                        initialData={
                            editingProduct
                        }

                        stores={stores}

                        onSubmit={
                            editingProduct
                                ? handleUpdate
                                : handleCreate
                        }

                        onCancel={() => {

                            setShowForm(false);

                            setEditingProduct(null);

                            setError("");

                        }}

                        submitting={submitting}
                    />

                )}


                {/* ====================================
                    PRODUCT TABLE
                   ==================================== */}

                {!showForm &&
                    !editingProduct && (

                        products.length === 0 ? (

                            <div className="empty-products">

                                <h2>
                                    No Products Found
                                </h2>

                                <p>
                                    Start by adding your
                                    first product.
                                </p>

                            </div>

                        ) : (

                            <ProductTable
                                products={products}
                                stores={stores}
                                onEdit={(product) => {

                                    setError("");

                                    setShowForm(false);

                                    setEditingProduct(
                                        product
                                    );

                                }}
                                onDelete={handleDelete}
                                deletingId={deletingId}
                            />

                        )
                    )}

            </div>

        </div>
    );
}

export default Products;