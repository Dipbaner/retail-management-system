import { useEffect, useState } from "react";


function ProductForm({
    initialData = null,
    stores = [],
    onSubmit,
    onCancel,
    submitting = false
}) {

    const [formData, setFormData] = useState({
        productName: "",
        sku: "",
        category: "",
        price: "",
        quantity: "",
        description: "",
        storeId: ""
    });


    const [errors, setErrors] = useState({});


    // ============================================
    // INITIAL DATA
    // ============================================

    useEffect(() => {

        if (initialData) {

            setFormData({

                productName:
                    initialData.productName || "",

                sku:
                    initialData.sku || "",

                category:
                    initialData.category || "",

                price:
                    initialData.price ?? "",

                quantity:
                    initialData.quantity ?? "",

                description:
                    initialData.description || "",

                storeId:
                    initialData.storeId ?? ""

            });

        } else {

            setFormData({
                productName: "",
                sku: "",
                category: "",
                price: "",
                quantity: "",
                description: "",
                storeId: ""
            });
        }


        setErrors({});

    }, [initialData]);


    // ============================================
    // HANDLE CHANGE
    // ============================================

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;


        setFormData((previousData) => ({
            ...previousData,
            [name]: value
        }));


        if (errors[name]) {

            setErrors((previousErrors) => ({
                ...previousErrors,
                [name]: ""
            }));
        }
    };


    // ============================================
    // VALIDATION
    // ============================================

    const validateForm = () => {

        const newErrors = {};


        if (!formData.productName.trim()) {

            newErrors.productName =
                "Product name is required.";

        } else if (
            formData.productName.trim().length < 2
        ) {

            newErrors.productName =
                "Product name must contain at least 2 characters.";
        }


        if (!formData.sku.trim()) {

            newErrors.sku =
                "SKU is required.";

        } else if (
            formData.sku.trim().length < 2
        ) {

            newErrors.sku =
                "SKU must contain at least 2 characters.";
        }


        if (!formData.category.trim()) {

            newErrors.category =
                "Category is required.";
        }


        if (
            formData.price === "" ||
            Number(formData.price) < 0
        ) {

            newErrors.price =
                "Price must be greater than or equal to 0.";
        }


        if (
            formData.quantity === "" ||
            Number(formData.quantity) < 0 ||
            !Number.isInteger(
                Number(formData.quantity)
            )
        ) {

            newErrors.quantity =
                "Quantity must be a whole number greater than or equal to 0.";
        }


        if (!formData.storeId) {

            newErrors.storeId =
                "Please select a store.";
        }


        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };


    // ============================================
    // SUBMIT
    // ============================================

    const handleSubmit = async (event) => {

        event.preventDefault();


        if (submitting) {
            return;
        }


        if (!validateForm()) {
            return;
        }


        await onSubmit({

            productName:
                formData.productName.trim(),

            sku:
                formData.sku.trim().toUpperCase(),

            category:
                formData.category.trim(),

            price:
                Number(formData.price),

            quantity:
                Number(formData.quantity),

            description:
                formData.description.trim(),

            storeId:
                Number(formData.storeId)

        });
    };


    const isEditMode =
        Boolean(initialData);


    return (

        <form
            className="product-form"
            onSubmit={handleSubmit}
            noValidate
        >

            <div className="product-form-header">

                <h2>
                    {isEditMode
                        ? "Update Product"
                        : "Add Product"
                    }
                </h2>

                <p>
                    {isEditMode
                        ? "Update product information."
                        : "Enter the details of your new product."
                    }
                </p>

            </div>


            {/* PRODUCT NAME */}

            <div className="product-form-group">

                <label htmlFor="productName">
                    Product Name
                    <span>*</span>
                </label>

                <input
                    id="productName"
                    name="productName"
                    type="text"
                    placeholder="Enter product name"
                    value={formData.productName}
                    onChange={handleChange}
                    disabled={submitting}
                    className={
                        errors.productName
                            ? "input-error"
                            : ""
                    }
                />

                {errors.productName && (
                    <small>
                        {errors.productName}
                    </small>
                )}

            </div>


            {/* SKU */}

            <div className="product-form-group">

                <label htmlFor="sku">
                    SKU
                    <span>*</span>
                </label>

                <input
                    id="sku"
                    name="sku"
                    type="text"
                    placeholder="Example: WM-001"
                    value={formData.sku}
                    onChange={handleChange}
                    disabled={submitting}
                    className={
                        errors.sku
                            ? "input-error"
                            : ""
                    }
                />

                {errors.sku && (
                    <small>
                        {errors.sku}
                    </small>
                )}

            </div>


            {/* CATEGORY */}

            <div className="product-form-group">

                <label htmlFor="category">
                    Category
                    <span>*</span>
                </label>

                <input
                    id="category"
                    name="category"
                    type="text"
                    placeholder="Example: Electronics"
                    value={formData.category}
                    onChange={handleChange}
                    disabled={submitting}
                    className={
                        errors.category
                            ? "input-error"
                            : ""
                    }
                />

                {errors.category && (
                    <small>
                        {errors.category}
                    </small>
                )}

            </div>


            {/* PRICE */}

            <div className="product-form-group">

                <label htmlFor="price">
                    Price
                    <span>*</span>
                </label>

                <input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={handleChange}
                    disabled={submitting}
                    className={
                        errors.price
                            ? "input-error"
                            : ""
                    }
                />

                {errors.price && (
                    <small>
                        {errors.price}
                    </small>
                )}

            </div>


            {/* QUANTITY */}

            <div className="product-form-group">

                <label htmlFor="quantity">
                    Quantity
                    <span>*</span>
                </label>

                <input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="0"
                    step="1"
                    placeholder="0"
                    value={formData.quantity}
                    onChange={handleChange}
                    disabled={submitting}
                    className={
                        errors.quantity
                            ? "input-error"
                            : ""
                    }
                />

                {errors.quantity && (
                    <small>
                        {errors.quantity}
                    </small>
                )}

            </div>


            {/* STORE */}

            <div className="product-form-group">

                <label htmlFor="storeId">
                    Store
                    <span>*</span>
                </label>

                <select
                    id="storeId"
                    name="storeId"
                    value={formData.storeId}
                    onChange={handleChange}
                    disabled={
                        submitting ||
                        stores.length === 0
                    }
                    className={
                        errors.storeId
                            ? "input-error"
                            : ""
                    }
                >

                    <option value="">
                        Select a store
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

                {errors.storeId && (
                    <small>
                        {errors.storeId}
                    </small>
                )}

                {stores.length === 0 && (
                    <small>
                        No stores available.
                    </small>
                )}

            </div>


            {/* DESCRIPTION */}

            <div className="product-form-group">

                <label htmlFor="description">
                    Description
                </label>

                <textarea
                    id="description"
                    name="description"
                    rows="4"
                    placeholder="Enter product description"
                    value={formData.description}
                    onChange={handleChange}
                    disabled={submitting}
                />

            </div>


            {/* ACTIONS */}

            <div className="product-form-actions">

                <button
                    type="submit"
                    className="product-btn primary"
                    disabled={submitting}
                >

                    {submitting ? (

                        <>
                            <span className="button-spinner"></span>

                            {isEditMode
                                ? "Updating..."
                                : "Saving..."
                            }
                        </>

                    ) : (

                        isEditMode
                            ? "Update Product"
                            : "Add Product"

                    )}

                </button>


                <button
                    type="button"
                    className="product-btn secondary"
                    onClick={onCancel}
                    disabled={submitting}
                >
                    Cancel
                </button>

            </div>

        </form>
    );
}


export default ProductForm;