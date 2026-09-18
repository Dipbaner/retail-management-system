import { useEffect, useState } from "react";

import {
    getCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer
} from "../services/customerService";

import CustomerForm from "../components/CustomerForm";
import CustomerTable from "../components/CustomerTable";

import "../components/CustomerTable.css";
import "./Customers.css";

function Customers() {

    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formLoading, setFormLoading] = useState(false);

    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingCustomer, setEditingCustomer] =
        useState(null);

    const [searchTerm, setSearchTerm] = useState("");

    const loadCustomers = async () => {

        try {
            setLoading(true);
            setError("");

            const data = await getCustomers();

            setCustomers(data);

        } catch (error) {

            console.error(error);

            setError("Failed to load customers.");

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {
        loadCustomers();
    }, []);

    const handleAddClick = () => {
        setEditingCustomer(null);
        setShowForm(true);
    };

    const handleEdit = (customer) => {
        setEditingCustomer(customer);
        setShowForm(true);
    };

    const handleCancel = () => {
        setEditingCustomer(null);
        setShowForm(false);
    };

    const handleSubmit = async (customer) => {

        try {

            setFormLoading(true);
            setError("");

            if (editingCustomer) {

                const updatedCustomer =
                    await updateCustomer(
                        editingCustomer.id,
                        customer
                    );

                setCustomers((prev) =>
                    prev.map((item) =>
                        item.id === editingCustomer.id
                            ? updatedCustomer
                            : item
                    )
                );

            } else {

                const newCustomer =
                    await createCustomer(customer);

                setCustomers((prev) => [
                    ...prev,
                    newCustomer
                ]);
            }

            setShowForm(false);
            setEditingCustomer(null);

        } catch (error) {

            console.error(error);

            const message =
                error.response?.data?.message ||
                "Failed to save customer.";

            setError(message);

        } finally {

            setFormLoading(false);
        }
    };

    const handleDelete = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this customer?"
        );

        if (!confirmed) {
            return;
        }

        try {

            setError("");

            await deleteCustomer(id);

            setCustomers((prev) =>
                prev.filter(
                    (customer) => customer.id !== id
                )
            );

        } catch (error) {

            console.error(error);

            const message =
                error.response?.data?.message ||
                "Failed to delete customer.";

            setError(message);
        }
    };

    const filteredCustomers = customers.filter(
        (customer) =>
            customer.name
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            customer.email
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            customer.phone
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase())
    );

    const hasCustomers = customers.length > 0;
    const hasResults = filteredCustomers.length > 0;

    return (
        <div className="customers-page">

            {!showForm ? (
                <>

                    <header className="cx-header">

                        <div className="cx-header__text">
                            <h1>Customer directory</h1>
                            <p>
                                View, search, and manage
                                every retail customer on
                                file.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="cx-btn cx-btn--primary"
                            onClick={handleAddClick}
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                aria-hidden="true"
                            >
                                <path
                                    d="M8 3v10M3 8h10"
                                    stroke="currentColor"
                                    strokeWidth="1.6"
                                    strokeLinecap="round"
                                />
                            </svg>
                            Add customer
                        </button>

                    </header>

                    {error && (
                        <div
                            className="cx-alert"
                            role="alert"
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                aria-hidden="true"
                            >
                                <circle
                                    cx="8"
                                    cy="8"
                                    r="6.5"
                                    stroke="currentColor"
                                    strokeWidth="1.4"
                                />
                                <path
                                    d="M8 5.2v3.6M8 11h.01"
                                    stroke="currentColor"
                                    strokeWidth="1.4"
                                    strokeLinecap="round"
                                />
                            </svg>
                            {error}
                        </div>
                    )}

                    <div className="cx-toolbar">

                        <label className="cx-search">
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                aria-hidden="true"
                            >
                                <circle
                                    cx="7"
                                    cy="7"
                                    r="4.8"
                                    stroke="currentColor"
                                    strokeWidth="1.4"
                                />
                                <path
                                    d="M13 13l-2.7-2.7"
                                    stroke="currentColor"
                                    strokeWidth="1.4"
                                    strokeLinecap="round"
                                />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search by name, email, or phone"
                                value={searchTerm}
                                onChange={(e) =>
                                    setSearchTerm(
                                        e.target.value
                                    )
                                }
                                aria-label="Search customers"
                            />
                        </label>

                        <div
                            className="cx-counts"
                            aria-live="polite"
                        >
                            <div className="cx-counts__item">
                                <span>Total</span>
                                <strong>
                                    {customers.length}
                                </strong>
                            </div>
                            <div className="cx-counts__divider" />
                            <div className="cx-counts__item">
                                <span>Showing</span>
                                <strong>
                                    {
                                        filteredCustomers.length
                                    }
                                </strong>
                            </div>
                        </div>

                    </div>

                    <div className="cx-panel">

                        {loading ? (

                            <div className="cx-state">
                                <div className="cx-spinner" />
                                <p>Loading customers…</p>
                            </div>

                        ) : !hasCustomers ? (

                            <div className="cx-state">
                                <p className="cx-state__title">
                                    No customers yet
                                </p>
                                <p>
                                    Add your first customer
                                    to start building the
                                    directory.
                                </p>
                                <button
                                    type="button"
                                    className="cx-btn cx-btn--primary"
                                    onClick={handleAddClick}
                                >
                                    Add customer
                                </button>
                            </div>

                        ) : !hasResults ? (

                            <div className="cx-state">
                                <p className="cx-state__title">
                                    No matches for “
                                    {searchTerm}”
                                </p>
                                <p>
                                    Try a different name,
                                    email, or phone number.
                                </p>
                            </div>

                        ) : (

                            <CustomerTable
                                customers={filteredCustomers}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />

                        )}

                    </div>

                </>
            ) : (

                <CustomerForm
                    editingCustomer={editingCustomer}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    loading={formLoading}
                />

            )}

        </div>
    );
}

export default Customers;