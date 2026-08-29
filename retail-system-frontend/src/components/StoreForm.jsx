import { useEffect, useState } from "react";


function StoreForm({
    initialData = null,
    onSubmit,
    onCancel,
    submitting = false
}) {

    const [formData, setFormData] = useState({
        storeName: "",
        address: "",
        city: "",
        state: "",
        phone: "",
        email: ""
    });


    const [errors, setErrors] = useState({});


    /*
     * Populate form when editing a store
     */
    useEffect(() => {

        if (initialData) {

            setFormData({
                storeName: initialData.storeName || "",
                address: initialData.address || "",
                city: initialData.city || "",
                state: initialData.state || "",
                phone: initialData.phone || "",
                email: initialData.email || ""
            });

        } else {

            setFormData({
                storeName: "",
                address: "",
                city: "",
                state: "",
                phone: "",
                email: ""
            });

        }

        setErrors({});

    }, [initialData]);


    /*
     * Handle input changes
     */
    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value
        }));


        /*
         * Remove error for the field
         * once the user starts correcting it.
         */
        if (errors[name]) {

            setErrors((previousErrors) => ({
                ...previousErrors,
                [name]: ""
            }));

        }

    };


    /*
     * Validate form
     */
    const validateForm = () => {

        const newErrors = {};


        // Store name
        if (!formData.storeName.trim()) {

            newErrors.storeName =
                "Store name is required.";

        } else if (formData.storeName.trim().length < 3) {

            newErrors.storeName =
                "Store name must contain at least 3 characters.";

        }


        // Address
        if (!formData.address.trim()) {

            newErrors.address =
                "Address is required.";

        }


        // City
        if (!formData.city.trim()) {

            newErrors.city =
                "City is required.";

        }


        // State
        if (!formData.state.trim()) {

            newErrors.state =
                "State is required.";

        }


        // Phone
        if (!formData.phone.trim()) {

            newErrors.phone =
                "Phone number is required.";

        } else if (
            !/^[0-9]{10}$/.test(formData.phone.trim())
        ) {

            newErrors.phone =
                "Phone number must contain exactly 10 digits.";

        }


        // Email
        if (!formData.email.trim()) {

            newErrors.email =
                "Email is required.";

        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                formData.email.trim()
            )
        ) {

            newErrors.email =
                "Please enter a valid email address.";

        }


        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };


    /*
     * Submit form
     */
    const handleSubmit = async (event) => {

        event.preventDefault();


        if (submitting) {
            return;
        }


        const isValid = validateForm();


        if (!isValid) {
            return;
        }


        await onSubmit({
            storeName: formData.storeName.trim(),
            address: formData.address.trim(),
            city: formData.city.trim(),
            state: formData.state.trim(),
            phone: formData.phone.trim(),
            email: formData.email.trim()
        });

    };


    const isEditMode = Boolean(initialData);


    return (

        <form
            className="store-form"
            onSubmit={handleSubmit}
            noValidate
        >

            {/* =========================================
                FORM TITLE
               ========================================= */}

            <div className="form-header">

                <h2>
                    {isEditMode
                        ? "Edit Store"
                        : "Add Store"
                    }
                </h2>

                <p>
                    {isEditMode
                        ? "Update the store information below."
                        : "Enter the details for the new store."
                    }
                </p>

            </div>


            {/* =========================================
                STORE NAME
               ========================================= */}

            <div className="form-group">

                <label htmlFor="storeName">
                    Store Name
                    <span className="required">*</span>
                </label>

                <input
                    id="storeName"
                    name="storeName"
                    type="text"
                    placeholder="Enter store name"
                    value={formData.storeName}
                    onChange={handleChange}
                    className={
                        errors.storeName
                            ? "input-error"
                            : ""
                    }
                    disabled={submitting}
                />

                {errors.storeName && (
                    <span className="field-error">
                        {errors.storeName}
                    </span>
                )}

            </div>


            {/* =========================================
                ADDRESS
               ========================================= */}

            <div className="form-group">

                <label htmlFor="address">
                    Address
                    <span className="required">*</span>
                </label>

                <input
                    id="address"
                    name="address"
                    type="text"
                    placeholder="Enter store address"
                    value={formData.address}
                    onChange={handleChange}
                    className={
                        errors.address
                            ? "input-error"
                            : ""
                    }
                    disabled={submitting}
                />

                {errors.address && (
                    <span className="field-error">
                        {errors.address}
                    </span>
                )}

            </div>


            {/* =========================================
                CITY
               ========================================= */}

            <div className="form-group">

                <label htmlFor="city">
                    City
                    <span className="required">*</span>
                </label>

                <input
                    id="city"
                    name="city"
                    type="text"
                    placeholder="Enter city"
                    value={formData.city}
                    onChange={handleChange}
                    className={
                        errors.city
                            ? "input-error"
                            : ""
                    }
                    disabled={submitting}
                />

                {errors.city && (
                    <span className="field-error">
                        {errors.city}
                    </span>
                )}

            </div>


            {/* =========================================
                STATE
               ========================================= */}

            <div className="form-group">

                <label htmlFor="state">
                    State
                    <span className="required">*</span>
                </label>

                <input
                    id="state"
                    name="state"
                    type="text"
                    placeholder="Enter state"
                    value={formData.state}
                    onChange={handleChange}
                    className={
                        errors.state
                            ? "input-error"
                            : ""
                    }
                    disabled={submitting}
                />

                {errors.state && (
                    <span className="field-error">
                        {errors.state}
                    </span>
                )}

            </div>


            {/* =========================================
                PHONE
               ========================================= */}

            <div className="form-group">

                <label htmlFor="phone">
                    Phone
                    <span className="required">*</span>
                </label>

                <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Enter 10 digit phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    maxLength="10"
                    className={
                        errors.phone
                            ? "input-error"
                            : ""
                    }
                    disabled={submitting}
                />

                {errors.phone && (
                    <span className="field-error">
                        {errors.phone}
                    </span>
                )}

            </div>


            {/* =========================================
                EMAIL
               ========================================= */}

            <div className="form-group">

                <label htmlFor="email">
                    Email
                    <span className="required">*</span>
                </label>

                <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={handleChange}
                    className={
                        errors.email
                            ? "input-error"
                            : ""
                    }
                    disabled={submitting}
                />

                {errors.email && (
                    <span className="field-error">
                        {errors.email}
                    </span>
                )}

            </div>


            {/* =========================================
                BUTTONS
               ========================================= */}

            <div className="form-actions">

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                >

                    {submitting ? (

                        <span className="button-content">

                            <span className="spinner"></span>

                            {isEditMode
                                ? "Updating..."
                                : "Saving..."
                            }

                        </span>

                    ) : (

                        isEditMode
                            ? "Update Store"
                            : "Add Store"

                    )}

                </button>


                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={onCancel}
                    disabled={submitting}
                >
                    Cancel
                </button>

            </div>

        </form>
    );
}


export default StoreForm;