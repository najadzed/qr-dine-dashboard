import { useEffect, useState } from "react";
import "./owner.css";

const API = "https://qr-dine-backend-xbja.onrender.com/api";

export default function OrdersHistory() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  function fetchOrders() {
    fetch(`${API}/orders/`)
      .then(r => r.json())
      .then(setOrders);
  }

  function deleteOrder(id) {
    fetch(`${API}/order/delete/${id}/`, {
      method: "DELETE"
    }).then(fetchOrders);
  }

  return (
    <div>
      <h1 className="page-title">Orders Manager</h1>

      <div className="table-card">
        <table className="styled-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Table</th>
              <th>Status</th>
              <th>Total</th>
              <th>Time</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map(o => (
              <tr key={o.id}>
                <td>#{o.daily_number}</td>
                <td>Table {o.table}</td>
                <td>{o.status}</td>
                <td>₹ {o.total_price}</td>
                <td>
                  {new Date(o.created_at).toLocaleString()}
                </td>
                <td>
                  <button
                    style={{
                      background: "crimson",
                      padding: "6px 10px",
                      borderRadius: 6,
                      color: "white",
                      border: "none"
                    }}
                    onClick={() => deleteOrder(o.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
