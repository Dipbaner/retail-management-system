import { useEffect, useMemo, useState } from "react";

import { getCustomers } from "../services/customerService";
import { getProducts } from "../services/productService";
import { createOrder } from "../services/orderService";

import "./Sales.css";

function Sales() {

    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);

    const [selectedCustomer, setSelectedCustomer] =
        useState("");

    const [searchTerm, setSearchTerm] = useState("");

    const [discount, setDiscount] = useState(0);

    const [loading, setLoading] = useState(true);
    const [processingSale, setProcessingSale] =
        useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {

        const loadData = async () => {

            try {

                setLoading(true);
                setError("");

                const [customerData, productData] =
                    await Promise.all([
                        getCustomers(),
                        getProducts()
                    ]);

                setCustomers(customerData);
                setProducts(productData);

            } catch (error) {

                console.error(error);

                setError(
                    "Failed to load customers and products."
                );

            } finally {

                setLoading(false);
            }
        };

        loadData();

    }, []);

    const filteredProducts = useMemo(() => {

        const search = searchTerm
            .toLowerCase()
            .trim();

        if (!search) {
            return products;
        }

        return products.filter(
            (product) =>
                product.productName
                    ?.toLowerCase()
                    .includes(search) ||
                product.sku
                    ?.toLowerCase()
                    .includes(search) ||
                product.category
                    ?.toLowerCase()
                    .includes(search)
        );

    }, [products, searchTerm]);

    const addToCart = (product) => {

        setError("");
        setSuccess("");

        if (product.quantity <= 0) {
            setError(
                `${product.productName} is out of stock.`
            );
            return;
        }

        setCart((previousCart) => {

            const existingItem = previousCart.find(
                (item) => item.productId === product.id
            );

            if (existingItem) {

                if (
                    existingItem.quantity >=
                    product.quantity
                ) {
                    setError(
                        `Only ${product.quantity} units of ${product.productName} are available.`
                    );

                    return previousCart;
                }

                return previousCart.map((item) =>
                    item.productId === product.id
                        ? {
                              ...item,
                              quantity:
                                  item.quantity + 1
                          }
                        : item
                );
            }

            return [
                ...previousCart,
                {
                    productId: product.id,
                    productName: product.productName,
                    quantity: 1,
                    unitPrice: Number(product.price),
                    availableStock: product.quantity
                }
            ];
        });
    };

    const increaseQuantity = (productId) => {

        setCart((previousCart) =>
            previousCart.map((item) => {

                if (item.productId !== productId) {
                    return item;
                }

                if (
                    item.quantity >=
                    item.availableStock
                ) {
                    setError(
                        `Only ${item.availableStock} units of ${item.productName} are available.`
                    );

                    return item;
                }

                return {
                    ...item,
                    quantity: item.quantity + 1
                };
            })
        );
    };

    const decreaseQuantity = (productId) => {

        setCart((previousCart) =>
            previousCart
                .map((item) =>
                    item.productId === productId
                        ? {
                              ...item,
                              quantity:
                                  item.quantity - 1
                          }
                        : item
                )
                .filter(
                    (item) => item.quantity > 0
                )
        );
    };

    const removeFromCart = (productId) => {

        setCart((previousCart) =>
            previousCart.filter(
                (item) =>
                    item.productId !== productId
            )
        );
    };

    const subtotal = useMemo(() => {

        return cart.reduce(
            (total, item) =>
                total +
                item.unitPrice * item.quantity,
            0
        );

    }, [cart]);

    const validDiscount = Math.min(
        Math.max(Number(discount) || 0, 0),
        subtotal
    );

    const total = subtotal - validDiscount;

    const handleCompleteSale = async () => {

        setError("");
        setSuccess("");

        if (!selectedCustomer) {
            setError("Please select a customer.");
            return;
        }

        if (cart.length === 0) {
            setError(
                "Please add at least one product to the cart."
            );
            return;
        }

        if (Number(discount) > subtotal) {
            setError(
                "Discount cannot be greater than subtotal."
            );
            return;
        }

        const orderRequest = {
            customerId: Number(selectedCustomer),

            items: cart.map((item) => ({
                productId: item.productId,
                quantity: item.quantity
            })),

            discount: validDiscount
        };

        try {

            setProcessingSale(true);

            const order =
                await createOrder(orderRequest);

            setSuccess(
                `Sale completed successfully. Order #${order.id} created.`
            );

            setCart([]);
            setSelectedCustomer("");
            setDiscount(0);
            setSearchTerm("");

            // Refresh products so stock displayed
            // in the POS is current.
            const updatedProducts =
                await getProducts();

            setProducts(updatedProducts);

        } catch (error) {

            console.error(error);

            const message =
                error.response?.data?.message ||
                "Failed to complete sale.";

            setError(message);

        } finally {

            setProcessingSale(false);
        }
    };

    if (loading) {
        return (
            <div className="sales-loading">
                Loading sales screen...
            </div>
        );
    }

    return (
        <div className="sales-page">

            <div className="sales-header">

                <div>
                    <h1>Sales / POS</h1>

                    <p>
                        Create and process customer sales
                    </p>
                </div>

            </div>

            {error && (
                <div className="sales-message error">
                    {error}
                </div>
            )}

            {success && (
                <div className="sales-message success">
                    {success}
                </div>
            )}

            <div className="sales-layout">

                {/* LEFT SIDE */}

                <div className="products-section">

                    <div className="sales-card">

                        <h2>Customer</h2>

                        <select
                            value={selectedCustomer}
                            onChange={(e) =>
                                setSelectedCustomer(
                                    e.target.value
                                )
                            }
                        >
                            <option value="">
                                Select Customer
                            </option>

                            {customers.map(
                                (customer) => (
                                    <option
                                        key={customer.id}
                                        value={
                                            customer.id
                                        }
                                    >
                                        {customer.name} -{" "}
                                        {customer.phone}
                                    </option>
                                )
                            )}
                        </select>

                    </div>

                    <div className="sales-card">

                        <div className="section-title">

                            <h2>Products</h2>

                            <span>
                                {filteredProducts.length}{" "}
                                products
                            </span>

                        </div>

                        <input
                            className="product-search"
                            type="text"
                            placeholder="Search product, SKU or category..."
                            value={searchTerm}
                            onChange={(e) =>
                                setSearchTerm(
                                    e.target.value
                                )
                            }
                        />

                        <div className="product-grid">

                            {filteredProducts.length ===
                            0 ? (

                                <div className="no-products">
                                    No products found.
                                </div>

                            ) : (

                                filteredProducts.map(
                                    (product) => (
                                        <div
                                            className="product-card"
                                            key={product.id}
                                        >

                                            <div>
                                                <h3>
                                                    {
                                                        product.productName
                                                    }
                                                </h3>

                                                <p>
                                                    SKU:{" "}
                                                    {
                                                        product.sku
                                                    }
                                                </p>

                                                <p>
                                                    {
                                                        product.category
                                                    }
                                                </p>
                                            </div>

                                            <div className="product-bottom">

                                                <strong>
                                                    ₹
                                                    {Number(
                                                        product.price
                                                    ).toFixed(
                                                        2
                                                    )}
                                                </strong>

                                                <span
                                                    className={
                                                        product.quantity >
                                                        0
                                                            ? "stock available"
                                                            : "stock unavailable"
                                                    }
                                                >
                                                    Stock:{" "}
                                                    {
                                                        product.quantity
                                                    }
                                                </span>

                                            </div>

                                            <button
                                                className="add-cart-btn"
                                                onClick={() =>
                                                    addToCart(
                                                        product
                                                    )
                                                }
                                                disabled={
                                                    product.quantity <=
                                                    0
                                                }
                                            >
                                                {product.quantity >
                                                0
                                                    ? "Add to Cart"
                                                    : "Out of Stock"}
                                            </button>

                                        </div>
                                    )
                                )
                            )}

                        </div>

                    </div>

                </div>

                {/* RIGHT SIDE */}

                <div className="cart-section">

                    <div className="sales-card cart-card">

                        <div className="section-title">

                            <h2>Shopping Cart</h2>

                            <span>
                                {cart.length} items
                            </span>

                        </div>

                        {cart.length === 0 ? (

                            <div className="empty-cart">

                                <h3>
                                    Your cart is empty
                                </h3>

                                <p>
                                    Add products to begin
                                    a sale.
                                </p>

                            </div>

                        ) : (

                            <div className="cart-items">

                                {cart.map((item) => (

                                    <div
                                        className="cart-item"
                                        key={
                                            item.productId
                                        }
                                    >

                                        <div className="cart-item-info">

                                            <h3>
                                                {
                                                    item.productName
                                                }
                                            </h3>

                                            <p>
                                                ₹
                                                {item.unitPrice.toFixed(
                                                    2
                                                )}{" "}
                                                each
                                            </p>

                                        </div>

                                        <div className="quantity-controls">

                                            <button
                                                onClick={() =>
                                                    decreaseQuantity(
                                                        item.productId
                                                    )
                                                }
                                            >
                                                −
                                            </button>

                                            <span>
                                                {
                                                    item.quantity
                                                }
                                            </span>

                                            <button
                                                onClick={() =>
                                                    increaseQuantity(
                                                        item.productId
                                                    )
                                                }
                                            >
                                                +
                                            </button>

                                        </div>

                                        <strong>
                                            ₹
                                            {(
                                                item.unitPrice *
                                                item.quantity
                                            ).toFixed(
                                                2
                                            )}
                                        </strong>

                                        <button
                                            className="remove-btn"
                                            onClick={() =>
                                                removeFromCart(
                                                    item.productId
                                                )
                                            }
                                        >
                                            ×
                                        </button>

                                    </div>

                                ))}

                            </div>
                        )}

                        <div className="sale-summary">

                            <div>
                                <span>
                                    Subtotal
                                </span>

                                <strong>
                                    ₹
                                    {subtotal.toFixed(
                                        2
                                    )}
                                </strong>
                            </div>

                            <div className="discount-row">

                                <label htmlFor="discount">
                                    Discount
                                </label>

                                <input
                                    id="discount"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={discount}
                                    onChange={(e) =>
                                        setDiscount(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>

                            <div className="total-row">

                                <span>Total</span>

                                <strong>
                                    ₹
                                    {total.toFixed(
                                        2
                                    )}
                                </strong>

                            </div>

                            <button
                                className="complete-sale-btn"
                                onClick={
                                    handleCompleteSale
                                }
                                disabled={
                                    processingSale ||
                                    cart.length === 0
                                }
                            >
                                {processingSale
                                    ? "Processing..."
                                    : "Complete Sale"}
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Sales;