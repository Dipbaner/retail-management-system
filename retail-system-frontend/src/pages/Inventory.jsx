import { useEffect, useMemo, useState } from "react";

import {
    getStockMovements,
    createStockMovement
} from "../services/inventoryService";

import { getProducts } from "../services/productService";

import StockMovementForm
    from "../components/StockMovementForm";

import InventoryTable
    from "../components/InventoryTable";

import "./Inventory.css";


function Inventory() {

    const [products, setProducts] =
        useState([]);

    const [movements, setMovements] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [submitting, setSubmitting] =
        useState(false);

    const [showForm, setShowForm] =
        useState(false);

    const [error, setError] =
        useState("");


    // ============================================
    // LOAD DATA
    // ============================================

    useEffect(() => {

        const loadInventory = async () => {

            try {

                setLoading(true);

                setError("");


                const [
                    productsData,
                    movementsData
                ] = await Promise.all([

                    getProducts(),

                    getStockMovements()

                ]);


                setProducts(productsData);

                setMovements(movementsData);

            } catch (error) {

                console.error(
                    "Load inventory error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load inventory."
                );

            } finally {

                setLoading(false);
            }
        };


        loadInventory();

    }, []);


    // ============================================
    // CREATE MOVEMENT
    // ============================================

    const handleCreateMovement =
        async (movement) => {

            try {

                setSubmitting(true);

                setError("");


                const newMovement =
                    await createStockMovement(
                        movement
                    );


                setMovements(
                    (previousMovements) => [
                        newMovement,
                        ...previousMovements
                    ]
                );


                // Refresh products because
                // backend changed the quantity
                const updatedProducts =
                    await getProducts();


                setProducts(updatedProducts);


                setShowForm(false);

            } catch (error) {

                console.error(
                    "Create movement error:",
                    error
                );


                setError(
                    error.response?.data?.message ||
                    error.message ||
                    "Failed to record stock movement."
                );

            } finally {

                setSubmitting(false);
            }
        };


    // ============================================
    // INVENTORY STATISTICS
    // ============================================

    const totalProducts =
        products.length;


    const totalStock =
        products.reduce(
            (total, product) =>
                total +
                Number(product.quantity || 0),
            0
        );


    const lowStock =
        products.filter(
            (product) =>
                Number(product.quantity || 0) > 0 &&
                Number(product.quantity || 0) <= 10
        ).length;


    const outOfStock =
        products.filter(
            (product) =>
                Number(product.quantity || 0) === 0
        ).length;


    // ============================================
    // RECENT MOVEMENTS
    // ============================================

    const recentMovements = useMemo(() => {

        return [...movements]
            .sort(
                (a, b) =>
                    new Date(b.createdAt) -
                    new Date(a.createdAt)
            );

    }, [movements]);


    // ============================================
    // LOADING
    // ============================================

    if (loading) {

        return (

            <div className="inventory-page">

                <div className="inventory-loading">

                    <div className="inventory-spinner"></div>

                    <p>
                        Loading inventory...
                    </p>

                </div>

            </div>
        );
    }


    // ============================================
    // RENDER
    // ============================================

    return (

        <div className="inventory-page">

            <div className="inventory-container">


                {/* ==================================
                    HEADER
                   ================================== */}

                <div className="inventory-header">

                    <div>

                        <h1>
                            Inventory Management
                        </h1>

                        <p>
                            Track stock in, stock out,
                            and inventory movements.
                        </p>

                    </div>


                    {!showForm && (

                        <button
                            className="add-stock-btn"
                            onClick={() => {

                                setError("");

                                setShowForm(true);

                            }}
                        >
                            + Stock Movement
                        </button>

                    )}

                </div>


                {/* ==================================
                    ERROR
                   ================================== */}

                {error && (

                    <div className="inventory-error">

                        {error}

                    </div>

                )}


                {/* ==================================
                    STATISTICS
                   ================================== */}

                {!showForm && (

                    <div className="inventory-stats">


                        <div className="inventory-stat">

                            <span className="stat-symbol">
                                📦
                            </span>

                            <div>

                                <p>
                                    Products
                                </p>

                                <strong>
                                    {totalProducts}
                                </strong>

                            </div>

                        </div>


                        <div className="inventory-stat">

                            <span className="stat-symbol">
                                🏷️
                            </span>

                            <div>

                                <p>
                                    Total Stock
                                </p>

                                <strong>
                                    {totalStock}
                                </strong>

                            </div>

                        </div>


                        <div className="inventory-stat warning">

                            <span className="stat-symbol">
                                ⚠️
                            </span>

                            <div>

                                <p>
                                    Low Stock
                                </p>

                                <strong>
                                    {lowStock}
                                </strong>

                            </div>

                        </div>


                        <div className="inventory-stat danger">

                            <span className="stat-symbol">
                                🚫
                            </span>

                            <div>

                                <p>
                                    Out of Stock
                                </p>

                                <strong>
                                    {outOfStock}
                                </strong>

                            </div>

                        </div>


                    </div>

                )}


                {/* ==================================
                    FORM
                   ================================== */}

                {showForm && (

                    <StockMovementForm

                        products={products}

                        onSubmit={
                            handleCreateMovement
                        }

                        onCancel={() => {

                            setShowForm(false);

                            setError("");

                        }}

                        submitting={submitting}

                    />

                )}


                {/* ==================================
                    MOVEMENT HISTORY
                   ================================== */}

                {!showForm && (

                    <section className="movement-section">

                        <div className="section-heading">

                            <div>

                                <h2>
                                    Stock Movement History
                                </h2>

                                <p>
                                    Recent inventory transactions
                                </p>

                            </div>

                        </div>


                        <InventoryTable

                            movements={
                                recentMovements
                            }

                            products={products}

                        />

                    </section>

                )}

            </div>

        </div>
    );
}


export default Inventory;