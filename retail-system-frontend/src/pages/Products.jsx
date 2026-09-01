import { useEffect, useMemo, useState } from "react";

import {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct
} from "../services/productService";

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


    // ============================================
    // SEARCH AND FILTER STATE
    // ============================================

    const [searchTerm, setSearchTerm] = useState("");

    const [selectedCategory, setSelectedCategory] =
        useState("ALL");

    const [selectedStore, setSelectedStore] =
        useState("ALL");


    // ============================================
    // LOAD INITIAL DATA
    // ============================================

    useEffect(() => {

        const loadInitialData = async () => {

            try {

                setLoading(true);

                setError("");

                const [
                    productsData,
                    storesData
                ] = await Promise.all([
                    getProducts(),
                    getStores()
                ]);

                setProducts(productsData);

                setStores(storesData);

            } catch (error) {

                console.error(
                    "Load product page error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load product data."
                );

            } finally {

                setLoading(false);

            }
        };


        loadInitialData();

    }, []);


    // ============================================
    // CREATE PRODUCT
    // ============================================

    const handleCreate = async (product) => {

        try {

            setError("");

            setSubmitting(true);

            const newProduct =
                await createProduct(product);

            setProducts((previousProducts) => [
                ...previousProducts,
                newProduct
            ]);

            setShowForm(false);

        } catch (error) {

            console.error(
                "Create product error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to create product."
            );

        } finally {

            setSubmitting(false);
        }
    };


    // ============================================
    // UPDATE PRODUCT
    // ============================================

    const handleUpdate = async (product) => {

        try {

            setError("");

            setSubmitting(true);

            const updatedProduct =
                await updateProduct(
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

        } catch (error) {

            console.error(
                "Update product error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to update product."
            );

        } finally {

            setSubmitting(false);
        }
    };


    // ============================================
    // DELETE PRODUCT
    // ============================================

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


    // ============================================
    // GET UNIQUE CATEGORIES
    // ============================================

    const categories = useMemo(() => {

        return [
            ...new Set(
                products
                    .map(
                        (product) =>
                            product.category
                    )
                    .filter(Boolean)
            )
        ].sort();

    }, [products]);


    // ============================================
    // FILTER PRODUCTS
    // ============================================

    const filteredProducts = useMemo(() => {

        return products.filter((product) => {

            const search =
                searchTerm
                    .trim()
                    .toLowerCase();


            const matchesSearch =
                !search ||
                product.productName
                    ?.toLowerCase()
                    .includes(search) ||
                product.sku
                    ?.toLowerCase()
                    .includes(search) ||
                product.category
                    ?.toLowerCase()
                    .includes(search);


            const matchesCategory =
                selectedCategory === "ALL" ||
                product.category === selectedCategory;


            const matchesStore =
                selectedStore === "ALL" ||
                String(product.storeId) ===
                    String(selectedStore);


            return (
                matchesSearch &&
                matchesCategory &&
                matchesStore
            );

        });

    }, [
        products,
        searchTerm,
        selectedCategory,
        selectedStore
    ]);


    // ============================================
    // INVENTORY STATISTICS
    // ============================================

    const totalProducts =
        products.length;


    const totalQuantity =
        products.reduce(
            (total, product) =>
                total +
                Number(product.quantity || 0),
            0
        );


    const totalInventoryValue =
        products.reduce(
            (total, product) =>
                total +
                (
                    Number(product.price || 0) *
                    Number(product.quantity || 0)
                ),
            0
        );


    const lowStockProducts =
        products.filter(
            (product) =>
                Number(product.quantity || 0) > 0 &&
                Number(product.quantity || 0) <= 10
        ).length;


    // ============================================
    // CLEAR FILTERS
    // ============================================

    const clearFilters = () => {

        setSearchTerm("");

        setSelectedCategory("ALL");

        setSelectedStore("ALL");
    };


    const filtersApplied =
        searchTerm.trim() !== "" ||
        selectedCategory !== "ALL" ||
        selectedStore !== "ALL";


    // ============================================
    // LOADING
    // ============================================

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


    // ============================================
    // RENDER
    // ============================================

    return (

        <div className="products-page">

            <div className="products-container">


                {/* ==================================
                    HEADER
                   ================================== */}

                <div className="products-header">

                    <div>

                        <h1>
                            Product Management
                        </h1>

                        <p>
                            Manage your retail products
                            and inventory.
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


                {/* ==================================
                    ERROR
                   ================================== */}

                {error && (

                    <div className="error-message">

                        <span>
                            {error}
                        </span>

                    </div>

                )}


                {/* ==================================
                    STATISTICS
                   ================================== */}

                {!showForm &&
                    !editingProduct && (

                    <div className="product-stats">


                        <div className="stat-card">

                            <div className="stat-icon">
                                📦
                            </div>

                            <div>

                                <p>
                                    Total Products
                                </p>

                                <h3>
                                    {totalProducts}
                                </h3>

                            </div>

                        </div>


                        <div className="stat-card">

                            <div className="stat-icon">
                                🏷️
                            </div>

                            <div>

                                <p>
                                    Total Stock
                                </p>

                                <h3>
                                    {totalQuantity}
                                </h3>

                            </div>

                        </div>


                        <div className="stat-card">

                            <div className="stat-icon">
                                💰
                            </div>

                            <div>

                                <p>
                                    Inventory Value
                                </p>

                                <h3>
                                    ₹
                                    {totalInventoryValue.toLocaleString(
                                        "en-IN",
                                        {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        }
                                    )}
                                </h3>

                            </div>

                        </div>


                        <div className="stat-card warning">

                            <div className="stat-icon">
                                ⚠️
                            </div>

                            <div>

                                <p>
                                    Low Stock
                                </p>

                                <h3>
                                    {lowStockProducts}
                                </h3>

                            </div>

                        </div>


                    </div>
                )}


                {/* ==================================
                    PRODUCT FORM
                   ================================== */}

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


                {/* ==================================
                    SEARCH / FILTERS
                   ================================== */}

                {!showForm &&
                    !editingProduct && (

                    <div className="product-filters">


                        <div className="search-box">

                            <span>
                                🔍
                            </span>

                            <input
                                type="text"
                                placeholder="Search by name, SKU or category..."
                                value={searchTerm}
                                onChange={(event) =>
                                    setSearchTerm(
                                        event.target.value
                                    )
                                }
                            />

                        </div>


                        <select
                            value={selectedCategory}
                            onChange={(event) =>
                                setSelectedCategory(
                                    event.target.value
                                )
                            }
                        >

                            <option value="ALL">
                                All Categories
                            </option>

                            {categories.map(
                                (category) => (

                                <option
                                    key={category}
                                    value={category}
                                >
                                    {category}
                                </option>

                            ))}

                        </select>


                        <select
                            value={selectedStore}
                            onChange={(event) =>
                                setSelectedStore(
                                    event.target.value
                                )
                            }
                        >

                            <option value="ALL">
                                All Stores
                            </option>

                            {stores.map((store) => (

                                <option
                                    key={store.id}
                                    value={store.id}
                                >
                                    {store.storeName}
                                </option>

                            ))}

                        </select>


                        {filtersApplied && (

                            <button
                                className="clear-filter-btn"
                                onClick={clearFilters}
                            >
                                Clear
                            </button>

                        )}

                    </div>

                )}


                {/* ==================================
                    TABLE / EMPTY STATE
                   ================================== */}

                {!showForm &&
                    !editingProduct && (

                    filteredProducts.length === 0 ? (

                        <div className="empty-products">

                            <div className="empty-icon">
                                📦
                            </div>

                            <h2>
                                {filtersApplied
                                    ? "No Matching Products"
                                    : "No Products Found"
                                }
                            </h2>

                            <p>

                                {filtersApplied
                                    ? "Try changing your search or filters."
                                    : "Start by adding your first product."
                                }

                            </p>


                            {filtersApplied && (

                                <button
                                    className="clear-empty-btn"
                                    onClick={clearFilters}
                                >
                                    Clear Filters
                                </button>

                            )}

                        </div>

                    ) : (

                        <>

                            {filtersApplied && (

                                <div className="results-info">

                                    Showing{" "}
                                    <strong>
                                        {filteredProducts.length}
                                    </strong>{" "}
                                    of{" "}
                                    <strong>
                                        {products.length}
                                    </strong>{" "}
                                    products

                                </div>

                            )}


                            <ProductTable

                                products={
                                    filteredProducts
                                }

                                stores={stores}

                                onEdit={(product) => {

                                    setError("");

                                    setShowForm(false);

                                    setEditingProduct(
                                        product
                                    );

                                }}

                                onDelete={
                                    handleDelete
                                }

                                deletingId={
                                    deletingId
                                }

                            />

                        </>

                    )

                )}

            </div>

        </div>
    );
}


export default Products;