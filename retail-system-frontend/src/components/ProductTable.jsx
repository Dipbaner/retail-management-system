function ProductTable({
    products,
    stores,
    onEdit,
    onDelete,
    deletingId
}) {


    const getStoreName = (storeId) => {

        const store = stores.find(
            (item) => item.id === storeId
        );

        return store
            ? store.storeName
            : "Unknown Store";
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

                        <th>Quantity</th>

                        <th>Store</th>

                        <th>Actions</th>

                    </tr>

                </thead>


                <tbody>

                    {products.map((product) => (

                        <tr key={product.id}>

                            <td>
                                #{product.id}
                            </td>


                            <td className="product-name">

                                {product.productName}

                            </td>


                            <td>

                                <span className="sku-badge">
                                    {product.sku}
                                </span>

                            </td>


                            <td>
                                {product.category}
                            </td>


                            <td>
                                ₹{Number(product.price).toFixed(2)}
                            </td>


                            <td>

                                <span
                                    className={
                                        product.quantity === 0
                                            ? "stock-empty"
                                            : "stock-available"
                                    }
                                >
                                    {product.quantity}
                                </span>

                            </td>


                            <td>
                                {getStoreName(
                                    product.storeId
                                )}
                            </td>


                            <td>

                                <div className="product-actions">

                                    <button
                                        className="edit-btn"
                                        onClick={() =>
                                            onEdit(product)
                                        }
                                        disabled={
                                            deletingId === product.id
                                        }
                                    >
                                        Edit
                                    </button>


                                    <button
                                        className="delete-btn"
                                        onClick={() =>
                                            onDelete(product.id)
                                        }
                                        disabled={
                                            deletingId === product.id
                                        }
                                    >

                                        {deletingId === product.id
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


export default ProductTable;