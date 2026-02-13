import { useEffect, useState } from "react";
const API = "https://qr-dine-backend-xbja.onrender.com/api";

export default function RestaurantManager() {
  const [restaurants, setRestaurants] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    fetchRestaurants();
  }, []);

  function fetchRestaurants() {
    fetch(`${API}/restaurants/`)
      .then(res => res.json())
      .then(setRestaurants);
  }

  function addRestaurant() {
    fetch(`${API}/restaurants/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    }).then(() => {
      setName("");
      fetchRestaurants();
    });
  }

  return (
    <div className="dashboard-container">
      <h1>Restaurant Manager</h1>

      <div style={{display:"flex", gap:10}}>
        <input
          placeholder="Restaurant Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <button onClick={addRestaurant}>Add</button>
      </div>

      <ul>
        {restaurants.map(r => (
          <li key={r.id}>{r.name}</li>
        ))}
      </ul>
    </div>
  );
}
