import { useEffect, useState, useRef } from "react";
import "./styles.css";

import { authFetch } from "../../api";
// const token = localStorage.getItem("token");
// const WS = `wss://qr-dine-backend-xbja.onrender.com/ws/orders/?token=${token}`;

function KitchenDashboard() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("All");
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioRef = useRef(null);
  const socketRef = useRef(null);

  // ---------- HELPER: Next Status ----------
  function nextStatus(status) {
    if (status === "Pending") return "Preparing";
    if (status === "Preparing") return "Ready";
    if (status === "Ready") return "Served";
    return null;
  }

  // ---------- FETCH ORDERS ----------
  function fetchOrders() {
  authFetch("/orders/").then(data => {
    data.sort((a, b) => b.id - a.id);
    setOrders(data);
  });
}


  // ---------- WEBSOCKET ----------
  useEffect(() => {
  fetchOrders();

  const token = localStorage.getItem("token");

  if (!token) {
    console.log("❌ No token found, WebSocket not connecting");
    return;
  }

  const socket = new WebSocket(
    `wss://qr-dine-backend-xbja.onrender.com/ws/orders/?token=${token}`
  );

  socketRef.current = socket;

  socket.onopen = () => {
    console.log("✅ WS Connected");
  };

  socket.onmessage = (event) => {
    console.log("📩 New Order Event:", event.data);
    fetchOrders();

    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };

  socket.onerror = (e) => {
    console.error("❌ WS Error:", e);
  };

  socket.onclose = () => {
    console.log("❌ WS Closed");
  };

  return () => socket.close();
}, []);

  // ---------- UPDATE STATUS ----------
  function updateStatus(orderId, status) {
  setOrders(prev =>
    prev.map(o =>
      o.id === orderId ? { ...o, status } : o
    )
  );

  authFetch("/order/update-status/", {
    method: "POST",
    body: JSON.stringify({ order_id: orderId, status })
  });
}


  // ---------- DELETE ----------
  function deleteOrder(orderId) {
  setOrders(prev => prev.filter(o => o.id !== orderId));

  authFetch(`/order/delete/${orderId}/`, {
    method: "DELETE"
  });
}


  // ---------- TIMER ----------
  function getOrderTime(created_at) {
    return Math.floor((Date.now() - new Date(created_at)) / 60000);
  }

  // ---------- FILTER ----------
  const filteredOrders = orders.filter(
    o => filter === "All" || o.status === filter
  );

  return (
    <div className="kitchen-container">

      <audio ref={audioRef} src="/ding.mp3" />

      {!soundEnabled && (
        <button
          className="sound-btn"
          onClick={() => {
            audioRef.current.play();
            setSoundEnabled(true);
          }}
        >
          🔊 Enable Kitchen Sound
        </button>
      )}

      <h1 className="kitchen-title">🍕 Kitchen Live Orders</h1>

      {/* FILTER BAR */}
      <div className="filter-bar">
        {["All", "Pending", "Preparing", "Ready", "Served"].map(f => (
          <button
            key={f}
            className={filter === f ? "active-filter" : ""}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* ORDERS */}
      <div className="orders-grid">
        {filteredOrders.length === 0 && <h2>No orders</h2>}

        {filteredOrders.map(order => {
          const minutes = getOrderTime(order.created_at);

          // Hide served after 10 mins
          if (order.status === "Served" && minutes > 10) return null;

          const isLate = minutes > 10;
          const next = nextStatus(order.status);

          return (
            <div
              key={order.id}
              className={`order-card ${order.status.toLowerCase()} ${isLate ? "late" : ""}`}
            >
              <div className="order-header">
                <h2>Order #{order.daily_number}</h2>
                <span className="table-badge">
                  Table {order.table}
                </span>
              </div>

              <p>Status: {order.status}</p>
              <p className="timer">⏱ {minutes} min</p>

              <ul>
                {order.items.map(i => (
                  <li key={i.item.id}>
                    {i.item.name} × {i.quantity}
                  </li>
                ))}
              </ul>

              <h3>₹{order.total_price}</h3>

              <div className="buttons">
                {next && (
                  <button
                    className="btn-action"
                    onClick={() => updateStatus(order.id, next)}
                  >
                    Mark as {next}
                  </button>
                )}

                <button
                  className="btn-delete"
                  onClick={() => deleteOrder(order.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default KitchenDashboard;
