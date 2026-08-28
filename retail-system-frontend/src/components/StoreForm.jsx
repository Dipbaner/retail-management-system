import { useState } from "react";


function StoreForm({
    initialData = null,
    onSubmit,
    onCancel
}) {

    const [formData, setFormData] = useState({

        storeName: initialData?.storeName || "",
        address: initialData?.address || "",
        city: initialData?.city || "",
        state: initialData?.state || "",
        phone: initialData?.phone || "",
        email: initialData?.email || ""

    });


    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value
        }));

    };


    const handleSubmit = (event) => {

        event.preventDefault();

        onSubmit(formData);

    };


    const isEditMode = Boolean(initialData);


    return (

        <form
            className="store-form"
            onSubmit={handleSubmit}
        >

            {/* Form Title */}

            <h2>
                {isEditMode
                    ? "Edit Store"
                    : "Add Store"
                }
            </h2>


            {/* Store Name */}

            <div className="form-group">

                <label htmlFor="storeName">
                    Store Name
                </label>

                <input
                    id="storeName"
                    name="storeName"
                    type="text"
                    placeholder="Enter store name"
                    value={formData.storeName}
                    onChange={handleChange}
                    required
                />

            </div>


            {/* Address */}

            <div className="form-group">

                <label htmlFor="address">
                    Address
                </label>

                <input
                    id="address"
                    name="address"
                    type="text"
                    placeholder="Enter store address"
                    value={formData.address}
                    onChange={handleChange}
                />

            </div>


            {/* City */}

            <div className="form-group">

                <label htmlFor="city">
                    City
                </label>

                <input
                    id="city"
                    name="city"
                    type="text"
                    placeholder="Enter city"
                    value={formData.city}
                    onChange={handleChange}
                />

            </div>


            {/* State */}

            <div className="form-group">

                <label htmlFor="state">
                    State
                </label>

                <input
                    id="state"
                    name="state"
                    type="text"
                    placeholder="Enter state"
                    value={formData.state}
                    onChange={handleChange}
                />

            </div>


            {/* Phone */}

            <div className="form-group">

                <label htmlFor="phone">
                    Phone
                </label>

                <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handleChange}
                />

            </div>


            {/* Email */}

            <div className="form-group">

                <label htmlFor="email">
                    Email
                </label>

                <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={handleChange}
                />

            </div>


            {/* Form Actions */}

            <div className="form-actions">

                <button
                    type="submit"
                    className="btn btn-primary"
                >
                    {isEditMode
                        ? "Update Store"
                        : "Add Store"
                    }
                </button>


                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={onCancel}
                >
                    Cancel
                </button>

            </div>

        </form>

    );
}


export default StoreForm;