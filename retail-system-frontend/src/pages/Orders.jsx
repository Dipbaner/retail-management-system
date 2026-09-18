import { useEffect, useState } from "react";

import {
  getOrders,
  getOrderById,
} from "../services/orderService";

import OrderTable from "../components/OrderTable";
import OrderDetails from "../components/OrderDetails";

import "./Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getOrders();

      setOrders(data);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to load orders."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = async (id) => {
    try {
      setDetailsLoading(true);
      setError("");

      const data = await getOrderById(id);

      setSelectedOrder(data);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to load order details."
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleCloseDetails = () => {
    setSelectedOrder(null);
  };

  const filteredOrders = orders.filter((order) => {
    const searchValue = search.toLowerCase();

    return (
      String(order.id).includes(searchValue) ||
      String(order.customerId).includes(searchValue) ||
      String(order.status)
        .toLowerCase()
        .includes(searchValue)
    );
  });

  if (selectedOrder) {
    return (
      <div className="orders-page">
        <OrderDetails
          order={selectedOrder}
          onClose={handleCloseDetails}
        />
      </div>
    );
  }

  return (
    <div className="orders-page">

      <div className="orders-header">

        <div>
          <h1>Order History</h1>

          <p>
            View and manage all completed sales orders.
          </p>
        </div>

        <button
          className="refresh-orders-btn"
          onClick={loadOrders}
        >
          ↻ Refresh
        </button>

      </div>

      {error && (
        <div className="orders-error">
          {error}
        </div>
      )}

      <div className="order-stats">

        <div className="order-stat-card">
          <span>Total Orders</span>
          <strong>{orders.length}</strong>
        </div>

        <div className="order-stat-card">
          <span>Completed</span>
          <strong>
            {
              orders.filter(
                (order) => order.status === "COMPLETED"
              ).length
            }
          </strong>
        </div>

        <div className="order-stat-card">
          <span>Pending</span>
          <strong>
            {
              orders.filter(
                (order) => order.status === "PENDING"
              ).length
            }
          </strong>
        </div>

        <div className="order-stat-card">
          <span>Total Sales</span>
          <strong>
            ₹
            {orders
              .filter(
                (order) => order.status === "COMPLETED"
              )
              .reduce(
                (sum, order) =>
                  sum + Number(order.totalAmount || 0),
                0
              )
              .toFixed(2)}
          </strong>
        </div>

      </div>

      <div className="orders-content">

        <div className="orders-toolbar">

          <input
            type="text"
            placeholder="Search by order ID, customer ID or status..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

        {loading ? (
          <div className="orders-loading">
            Loading orders...
          </div>
        ) : detailsLoading ? (
          <div className="orders-loading">
            Loading order details...
          </div>
        ) : (
          <OrderTable
            orders={filteredOrders}
            onView={handleViewOrder}
          />
        )}

      </div>

    </div>
  );
};

export default Orders;