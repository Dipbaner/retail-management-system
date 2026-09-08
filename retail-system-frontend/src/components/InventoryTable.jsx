function InventoryTable({
    movements = [],
    products = []
}) {


    const getProductName = (productId) => {

        const product = products.find(
            (item) =>
                String(item.id) ===
                String(productId)
        );


        return product
            ? product.productName
            : "Unknown Product";
    };


    const formatDate = (date) => {

        if (!date) {
            return "-";
        }


        return new Date(date).toLocaleString(
            "en-IN",
            {
                dateStyle: "medium",
                timeStyle: "short"
            }
        );
    };


    if (movements.length === 0) {

        return (

            <div className="inventory-empty">

                <div className="inventory-empty-icon">
                    📋
                </div>

                <h3>
                    No Stock Movements
                </h3>

                <p>
                    Stock transactions will appear here.
                </p>

            </div>
        );
    }


    return (

        <div className="inventory-table-wrapper">

            <table className="inventory-table">

                <thead>

                    <tr>

                        <th>ID</th>
                        <th>Date</th>
                        <th>Product</th>
                        <th>Type</th>
                        <th>Quantity</th>
                        <th>Reason</th>

                    </tr>

                </thead>


                <tbody>

                    {movements.map((movement) => (

                        <tr key={movement.id}>


                            <td>
                                #{movement.id}
                            </td>


                            <td>
                                {formatDate(
                                    movement.createdAt
                                )}
                            </td>


                            <td>

                                <strong>

                                    {getProductName(
                                        movement.productId
                                    )}

                                </strong>

                            </td>


                            {/* TYPE */}

                            <td>

                                <span
                                    className={
                                        movement.type === "STOCK_IN"
                                            ? "movement-badge movement-in"
                                            : "movement-badge movement-out"
                                    }
                                >

                                    {movement.type === "STOCK_IN"
                                        ? "↑ Stock In"
                                        : "↓ Stock Out"
                                    }

                                </span>

                            </td>


                            {/* QUANTITY */}

                            <td>

                                <strong
                                    className={
                                        movement.type === "STOCK_IN"
                                            ? "quantity-in"
                                            : "quantity-out"
                                    }
                                >

                                    {movement.type === "STOCK_IN"
                                        ? "+"
                                        : "-"
                                    }

                                    {Math.abs(
                                        movement.quantity
                                    )}

                                </strong>

                            </td>


                            <td>
                                {movement.reason || "-"}
                            </td>


                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
}


export default InventoryTable;