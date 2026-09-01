function ProductTable({
    products,
    stores,
    onEdit,
    onDelete,
    deletingId
}) {


    const getStoreName = (storeId) => {

        const store = stores.find(
            (item) =>
                String(item.id) ===
                String(storeId)
        );

        return store
            ? store.storeName
            : "Unknown Store";
    };


    const getStockStatus = (quantity) => {

        const stock =
            Number(quantity || 0);


        if (stock === 0) {

            return {
                className: "stock-out",
                text: "Out of Stock"
            };

        }


        if (stock <= 10) {

            return {
                className: "stock-low",
                text: "Low Stock"
            };

        }


        return {
            className: "stock-available",
            text: "In Stock"
        };
    };


    return (

        <div className="product-table-wrapper">

            <table className="product-table">

                <thead>

                    <tr>

                        <th>ID</th>

                        <th>Product</th>

                        <th>SKU</th>

                        <th>Category</th>

                        <th>Price</th>

                        <th>Stock</th>

                        <th>Store</th>

                        <th>Actions</th>

                    </tr>

                </thead>


                <tbody>

                    {products.map((product) => {

                        const stockStatus =
                            getStockStatus(
                                product.quantity
                            );


                        return (

                            <tr key={product.id}>

                                <td>
                                    #{product.id}
                                </td>


                                <td>

                                    <div className="product-name-cell">

                                        <strong>
                                            {product.productName}
                                        </strong>

                                        {product.description && (

                                            <small>
                                                {product.description}
                                            </small>

                                        )}

                                    </div>

                                </td>


                                <td>

                                    <span className="sku-badge">
                                        {product.sku}
                                    </span>

                                </td>


                                <td>
                                    {product.category}
                                </td>


                                <td className="price-cell">

                                    ₹
                                    {Number(
                                        product.price || 0
                                    ).toLocaleString(
                                        "en-IN",
                                        {
                                            minimumFractionDigits: 2
                                        }
                                    )}

                                </td>


                                <td>

                                    <div className="stock-cell">

                                        <strong>
                                            {product.quantity}
                                        </strong>

                                        <span
                                            className={
                                                stockStatus.className
                                            }
                                        >
                                            {stockStatus.text}
                                        </span>

                                    </div>

                                </td>


                                <td>

                                    <span className="store-badge">

                                        {getStoreName(
                                            product.storeId
                                        )}

                                    </span>

                                </td>


                                <td>

                                    <div className="product-actions">

                                        <button
                                            className="edit-btn"
                                            onClick={() =>
                                                onEdit(product)
                                            }
                                            disabled={
                                                deletingId ===
                                                product.id
                                            }
                                        >
                                            Edit
                                        </button>


                                        <button
                                            className="delete-btn"
                                            onClick={() =>
                                                onDelete(
                                                    product.id
                                                )
                                            }
                                            disabled={
                                                deletingId ===
                                                product.id
                                            }
                                        >

                                            {deletingId ===
                                            product.id
                                                ? "Deleting..."
                                                : "Delete"
                                            }

                                        </button>

                                    </div>

                                </td>

                            </tr>

                        );

                    })}

                </tbody>

            </table>

        </div>
    );
}


export default ProductTable;