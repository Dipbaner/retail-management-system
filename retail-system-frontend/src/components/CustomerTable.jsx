function CustomerTable({
    customers,
    onEdit,
    onDelete
}) {
    if (customers.length === 0) {
        return (
            <div className="empty-state">
                <h3>No Customers Found</h3>
                <p>Add a customer to get started.</p>
            </div>
        );
    }

    return (
        <div className="customer-table-wrapper">

            <table className="customer-table">

                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>

                    {customers.map((customer) => (
                        <tr key={customer.id}>

                            <td>{customer.id}</td>

                            <td className="customer-name">
                                {customer.name}
                            </td>

                            <td>{customer.email}</td>

                            <td>{customer.phone}</td>

                            <td>
                                {customer.address || "-"}
                            </td>

                            <td className="customer-actions">

                                <button
                                    className="edit-btn"
                                    onClick={() =>
                                        onEdit(customer)
                                    }
                                >
                                    Edit
                                </button>

                                <button
                                    className="delete-btn"
                                    onClick={() =>
                                        onDelete(customer.id)
                                    }
                                >
                                    Delete
                                </button>

                            </td>

                        </tr>
                    ))}

                </tbody>

            </table>

        </div>
    );
}

export default CustomerTable;