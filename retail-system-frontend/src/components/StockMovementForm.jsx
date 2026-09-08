import { useEffect, useState } from "react";

function StockMovementForm({
    products,
    onSubmit,
    onCancel,
    submitting
}) {

    const [formData, setFormData] = useState({
        productId: "",
        type: "STOCK_IN",
        quantity: "",
        reason: ""
    });

    const [selectedProduct, setSelectedProduct] =
        useState(null);

    const [error, setError] = useState("");


    // ============================================
    // UPDATE SELECTED PRODUCT
    // ============================================

    useEffect(() => {

        if (!formData.productId) {
            setSelectedProduct(null);
            return;
        }

        const product = products.find(
            (item) =>
                String(item.id) ===
                String(formData.productId)
        );

        setSelectedProduct(product || null);

    }, [
        formData.productId,
        products
    ]);


    // ============================================
    // INPUT CHANGE
    // ============================================

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

        setError("");
    };


    // ============================================
    // SUBMIT
    // ============================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        const quantity = Number(formData.quantity);


        if (!formData.productId) {
            setError("Please select a product.");
            return;
        }


        if (!quantity || quantity <= 0) {
            setError("Quantity must be greater than zero.");
            return;
        }


        // Prevent stock-out greater than current stock
        if (
            formData.type === "STOCK_OUT" &&
            selectedProduct &&
            quantity > Number(selectedProduct.quantity || 0)
        ) {

            setError(
                `Only ${selectedProduct.quantity} units are available.`
            );

            return;
        }


        try {

            const movementData = {
                productId: Number(formData.productId),
                type: formData.type,
                quantity: quantity,
                reason: formData.reason.trim()
            };

            console.log(
                "Sending Stock Movement:",
                movementData
            );

            await onSubmit(movementData);

        } catch (error) {

            console.error(
                "Stock movement submit error:",
                error
            );

        }
    };


    return (

        <div className="stock-form-card">

            <div className="stock-form-header">

                <h2>
                    Record Stock Movement
                </h2>

                <p>
                    Add or remove stock from your inventory.
                </p>

            </div>


            {error && (

                <div className="stock-form-error">
                    {error}
                </div>

            )}


            <form onSubmit={handleSubmit}>


                {/* PRODUCT */}

                <div className="form-group">

                    <label>
                        Product
                        <span>*</span>
                    </label>

                    <select
                        name="productId"
                        value={formData.productId}
                        onChange={handleChange}
                    >

                        <option value="">
                            Select Product
                        </option>

                        {products.map((product) => (

                            <option
                                key={product.id}
                                value={product.id}
                            >
                                {product.productName}
                            </option>

                        ))}

                    </select>

                </div>


                {/* CURRENT STOCK */}

                {selectedProduct && (

                    <div className="current-stock">

                        <span>
                            Current Stock
                        </span>

                        <strong>
                            {selectedProduct.quantity || 0}
                        </strong>

                    </div>

                )}


                {/* TYPE */}

                <div className="form-group">

                    <label>
                        Movement Type
                        <span>*</span>
                    </label>

                    <div className="movement-type">


                        {/* STOCK IN */}

                        <label
                            className={
                                formData.type === "STOCK_IN"
                                    ? "movement-option active-in"
                                    : "movement-option"
                            }
                        >

                            <input
                                type="radio"
                                name="type"
                                value="STOCK_IN"
                                checked={
                                    formData.type === "STOCK_IN"
                                }
                                onChange={handleChange}
                            />

                            <span>
                                Stock In
                            </span>

                        </label>


                        {/* STOCK OUT */}

                        <label
                            className={
                                formData.type === "STOCK_OUT"
                                    ? "movement-option active-out"
                                    : "movement-option"
                            }
                        >

                            <input
                                type="radio"
                                name="type"
                                value="STOCK_OUT"
                                checked={
                                    formData.type === "STOCK_OUT"
                                }
                                onChange={handleChange}
                            />

                            <span>
                                Stock Out
                            </span>

                        </label>

                    </div>

                </div>


                {/* QUANTITY */}

                <div className="form-group">

                    <label>
                        Quantity
                        <span>*</span>
                    </label>

                    <input
                        type="number"
                        name="quantity"
                        min="1"
                        value={formData.quantity}
                        onChange={handleChange}
                        placeholder="Enter quantity"
                    />

                </div>


                {/* REASON */}

                <div className="form-group">

                    <label>
                        Reason
                    </label>

                    <textarea
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                        placeholder="Example: New supplier shipment, customer sale..."
                        rows="3"
                    />

                </div>


                {/* ACTIONS */}

                <div className="stock-form-actions">

                    <button
                        type="button"
                        className="inventory-btn secondary"
                        onClick={onCancel}
                        disabled={submitting}
                    >
                        Cancel
                    </button>


                    <button
                        type="submit"
                        className="inventory-btn primary"
                        disabled={submitting}
                    >

                        {submitting
                            ? "Saving..."
                            : "Record Movement"
                        }

                    </button>

                </div>

            </form>

        </div>
    );
}

export default StockMovementForm;