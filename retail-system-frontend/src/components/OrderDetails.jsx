const OrderDetails = ({ order, onClose }) => {
  if (!order) {
    return null;
  }

  return (
    <div className="order-details-container">

      <div className="order-details-header">
        <div>
          <h2>Order #{order.id}</h2>

          <p>
            {order.createdAt
              ? new Date(order.createdAt).toLocaleString()
              : "-"}
          </p>
        </div>

        <span
          className={`status-badge ${order.status?.toLowerCase()}`}
        >
          {order.status}
        </span>
      </div>

      <div className="order-info-grid">

        <div className="order-info-card">
          <span>Customer ID</span>
          <strong>{order.customerId}</strong>
        </div>

        <div className="order-info-card">
          <span>Total Items</span>
          <strong>{order.items?.length || 0}</strong>
        </div>

        <div className="order-info-card">
          <span>Subtotal</span>
          <strong>
            ₹{Number(order.subTotal || 0).toFixed(2)}
          </strong>
        </div>

        <div className="order-info-card">
          <span>Discount</span>
          <strong>
            ₹{Number(order.discount || 0).toFixed(2)}
          </strong>
        </div>

      </div>

      <div className="order-items-section">

        <h3>Order Items</h3>

        <div className="order-items-table-wrapper">
          <table className="order-items-table">

            <thead>
              <tr>
                <th>Product ID</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              {order.items?.map((item) => (
                <tr key={item.id}>
                  <td>{item.productId}</td>

                  <td>{item.quantity}</td>

                  <td>
                    ₹{Number(item.unitPrice || 0).toFixed(2)}
                  </td>

                  <td>
                    ₹{Number(item.totalPrice || 0).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </div>

      <div className="order-summary">

        <div>
          <span>Subtotal</span>
          <strong>
            ₹{Number(order.subTotal || 0).toFixed(2)}
          </strong>
        </div>

        <div>
          <span>Discount</span>
          <strong>
            - ₹{Number(order.discount || 0).toFixed(2)}
          </strong>
        </div>

        <div className="grand-total">
          <span>Total Amount</span>
          <strong>
            ₹{Number(order.totalAmount || 0).toFixed(2)}
          </strong>
        </div>

      </div>

      <button
        className="close-details-btn"
        onClick={onClose}
      >
        Back to Orders
      </button>

    </div>
  );
};

export default OrderDetails;