function StoreTable({
    stores,
    onEdit,
    onDelete,
    deletingId
}) {

    return (

        <div className="store-table-container">

            <table className="store-table">

                <thead>

                    <tr>

                        <th>ID</th>
                        <th>Store Name</th>
                        <th>Address</th>
                        <th>City</th>
                        <th>State</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Actions</th>

                    </tr>

                </thead>


                <tbody>

                    {stores.map((store) => (

                        <tr key={store.id}>

                            <td className="store-id">
                                #{store.id}
                            </td>


                            <td className="store-name">
                                {store.storeName}
                            </td>


                            <td>
                                {store.address || "-"}
                            </td>


                            <td>
                                {store.city || "-"}
                            </td>


                            <td>
                                {store.state || "-"}
                            </td>


                            <td>
                                {store.phone || "-"}
                            </td>


                            <td>
                                {store.email || "-"}
                            </td>


                            <td>

                                <div className="action-buttons">

                                    <button
                                        type="button"
                                        className="btn btn-edit"
                                        onClick={() =>
                                            onEdit(store)
                                        }
                                        disabled={
                                            deletingId === store.id
                                        }
                                    >
                                        Edit
                                    </button>


                                    <button
                                        type="button"
                                        className="btn btn-delete"
                                        onClick={() =>
                                            onDelete(store.id)
                                        }
                                        disabled={
                                            deletingId === store.id
                                        }
                                    >

                                        {deletingId === store.id
                                            ? "Deleting..."
                                            : "Delete"
                                        }

                                    </button>

                                </div>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );
}


export default StoreTable;