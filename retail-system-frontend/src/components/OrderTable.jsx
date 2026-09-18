const OrderTable = ({ orders, onView }) => {
  if (!orders || orders.length === 0) {
    return (
      <div className="empty-orders">
        <h3>No orders found</h3>
        <p>Orders will appear here after completing a sale.</p>
      </div>
    );
  }

  return (
    <div className="order-table-wrapper">
      <table className="order-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer ID</th>
            <th>Date</th>
            <th>Items</th>
            <th>Subtotal</th>
            <th>Discount</th>
            <th>Total</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>#{order.id}</td>

              <td>{order.customerId}</td>

              <td>
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleString()
                  : "-"}
              </td>

              <td>{order.items?.length || 0}</td>

              <td>₹{Number(order.subTotal || 0).toFixed(2)}</td>

              <td>₹{Number(order.discount || 0).toFixed(2)}</td>

              <td className="order-total">
                ₹{Number(order.totalAmount || 0).toFixed(2)}
              </td>

              <td>
                <span
                  className={`status-badge ${order.status?.toLowerCase()}`}
                >
                  {order.status}
                </span>
              </td>

              <td>
                <button
                  className="view-order-btn"
                  onClick={() => onView(order.id)}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;