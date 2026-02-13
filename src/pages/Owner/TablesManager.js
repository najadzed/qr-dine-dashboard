import { useEffect, useState } from "react";
import "./owner.css";

const API = "https://qr-dine-backend-xbja.onrender.com/api";

export default function TablesManager() {
  const [tables, setTables] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [restaurantId, setRestaurantId] = useState("");
  const [tableNumber, setTableNumber] = useState("");

  useEffect(() => {
    fetchRestaurants();
    fetchTables();
  }, []);

  function fetchRestaurants() {
    fetch(`${API}/restaurants/`)
      .then(r => r.json())
      .then(setRestaurants);
  }

  function fetchTables() {
    fetch(`${API}/tables/`)
      .then(r => r.json())
      .then(setTables);
  }

  function addTable() {
    if (!restaurantId || !tableNumber) return;

    fetch(`${API}/tables/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        table_number: tableNumber,
        restaurant: restaurantId
      })
    }).then(() => {
      setTableNumber("");
      fetchTables();
    });
  }

  function deleteTable(id) {
    fetch(`${API}/tables/${id}/`, {
      method: "DELETE"
    }).then(fetchTables);
  }

  return (
    <div>
      <h1 className="page-title">Tables Manager</h1>

      <div className="kpi-card" style={{ marginBottom: 30 }}>
        <div className="form-row">
          <select
            onChange={e => setRestaurantId(e.target.value)}
          >
            <option>Select Restaurant</option>
            {restaurants.map(r => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>

          <input
            placeholder="Table number"
            value={tableNumber}
            onChange={e => setTableNumber(e.target.value)}
          />

          <button onClick={addTable}>Add</button>
        </div>
      </div>

      <div className="card-grid">
        {tables.map(t => (
          <div key={t.id} className="data-card">
            <h3>Table {t.table_number}</h3>
            <p>{t.restaurant_name}</p>

            <button
              style={{ background: "crimson", marginTop: 10 }}
              onClick={() => deleteTable(t.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
