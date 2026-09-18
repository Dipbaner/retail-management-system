import { useEffect, useState } from "react";
import "./CustomerForm.css";

const initialForm = {
    name: "",
    email: "",
    phone: "",
    address: ""
};

function CustomerForm({
    editingCustomer,
    onSubmit,
    onCancel,
    loading
}) {
    const [formData, setFormData] = useState(initialForm);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (editingCustomer) {
            setFormData({
                name: editingCustomer.name || "",
                email: editingCustomer.email || "",
                phone: editingCustomer.phone || "",
                address: editingCustomer.address || ""
            });
        } else {
            setFormData(initialForm);
        }

        setErrors({});
    }, [editingCustomer]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: ""
        }));
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Customer name is required.";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required.";
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
        ) {
            newErrors.email = "Enter a valid email address.";
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "Phone number is required.";
        }

        if (formData.address.length > 255) {
            newErrors.address =
                "Address cannot exceed 255 characters.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        onSubmit(formData);
    };

    return (
        <div className="customer-form-container">

            <div className="customer-form-card">

                <div className="customer-form-header">
                    <h2>
                        {editingCustomer
                            ? "Update Customer"
                            : "Add Customer"}
                    </h2>

                    <p>
                        {editingCustomer
                            ? "Update customer information"
                            : "Enter customer information"}
                    </p>
                </div>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label htmlFor="name">
                            Customer Name
                        </label>

                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter customer name"
                        />

                        {errors.name && (
                            <span className="form-error">
                                {errors.name}
                            </span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter email address"
                        />

                        {errors.email && (
                            <span className="form-error">
                                {errors.email}
                            </span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">
                            Phone
                        </label>

                        <input
                            id="phone"
                            name="phone"
                            type="text"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter phone number"
                        />

                        {errors.phone && (
                            <span className="form-error">
                                {errors.phone}
                            </span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="address">
                            Address
                        </label>

                        <textarea
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Enter customer address"
                            rows="3"
                        />

                        {errors.address && (
                            <span className="form-error">
                                {errors.address}
                            </span>
                        )}
                    </div>

                    <div className="customer-form-actions">

                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={onCancel}
                            disabled={loading}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={loading}
                        >
                            {loading
                                ? "Saving..."
                                : editingCustomer
                                    ? "Update Customer"
                                    : "Add Customer"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default CustomerForm;