import { useEffect, useState, useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import "./owner.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

const API = "https://qr-dine-backend-xbja.onrender.com/api";

export default function Dashboard() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch(`${API}/orders/`)
      .then(res => res.json())
      .then(setOrders);
  }, []);

  const today = new Date().toDateString();

  const todayOrders = useMemo(() =>
    orders.filter(o =>
      new Date(o.created_at).toDateString() === today
    ), [orders]
  );

  const totalRevenue = useMemo(() =>
    orders.reduce((sum, o) => sum + o.total_price, 0),
    [orders]
  );

  const todayRevenue = useMemo(() =>
    todayOrders.reduce((sum, o) => sum + o.total_price, 0),
    [todayOrders]
  );

  function count(status) {
    return orders.filter(o => o.status === status).length;
  }

  /* ================= REVENUE GRAPH (LAST 7 DAYS) ================= */

  const revenueByDate = {};

  orders.forEach(order => {
    const date = new Date(order.created_at).toLocaleDateString();
    revenueByDate[date] =
      (revenueByDate[date] || 0) + order.total_price;
  });

  const revenueLabels = Object.keys(revenueByDate).slice(-7);
  const revenueData = revenueLabels.map(d => revenueByDate[d]);

  const revenueChart = {
    labels: revenueLabels,
    datasets: [
      {
        label: "Revenue",
        data: revenueData,
        borderColor: "#6366f1",
        backgroundColor: "rgba(99,102,241,0.2)",
        tension: 0.4,
      },
    ],
  };

  /* ================= ORDER HEATMAP (HOUR BASED) ================= */

  const hourlyMap = new Array(24).fill(0);

  orders.forEach(order => {
    const hour = new Date(order.created_at).getHours();
    hourlyMap[hour]++;
  });

  const heatmapData = {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [
      {
        label: "Orders",
        data: hourlyMap,
        backgroundColor: "#10b981",
      },
    ],
  };

  return (
    <div className="dashboard-container">

      <h1 className="page-title">📊 Restaurant Analytics</h1>

      {/* KPI */}
      <div className="kpi-grid">
        <div className="kpi-card highlight">
          <h3>Total Revenue</h3>
          <p>₹ {totalRevenue.toLocaleString()}</p>
        </div>

        <div className="kpi-card">
          <h3>Today's Revenue</h3>
          <p>₹ {todayRevenue.toLocaleString()}</p>
        </div>

        <div className="kpi-card">
          <h3>Total Orders</h3>
          <p>{orders.length}</p>
        </div>

        <div className="kpi-card">
          <h3>Today's Orders</h3>
          <p>{todayOrders.length}</p>
        </div>
      </div>

      {/* STATUS */}
      <div className="status-grid">
        <div className="status-card pending">
          Pending: {count("Pending")}
        </div>
        <div className="status-card preparing">
          Preparing: {count("Preparing")}
        </div>
        <div className="status-card ready">
          Ready: {count("Ready")}
        </div>
        <div className="status-card served">
          Served: {count("Served")}
        </div>
      </div>

      {/* CHART SECTION */}
      <div className="charts-grid">
        <div className="chart-card">
          <h2>Revenue (Last 7 Days)</h2>
          <Line data={revenueChart} />
        </div>

        <div className="chart-card">
          <h2>Order Heatmap (Hourly)</h2>
          <Bar data={heatmapData} />
        </div>
      </div>

    </div>
  );
}
